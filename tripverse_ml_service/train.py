import pandas as pd
import numpy as np
import ast
import json
import os
from scipy import sparse
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import SGDClassifier

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, "data")
MODEL = os.path.join(BASE, "model")

def parse_list(x):
    if pd.isna(x):
        return []
    try:
        v = ast.literal_eval(str(x))
        return [str(i) for i in v] if isinstance(v, list) else []
    except:
        return []

users = pd.read_csv(os.path.join(DATA, "Stravl_Travel_Preference_Data.csv"))
mapping = pd.read_csv(os.path.join(DATA, "destination_mapping.csv"))

multi_cols = ["form_a", "form_f", "form_g", "form_rr"]
single_cols = ["form_b", "form_c", "form_h", "form_i", "form_j", "form_r"]

parts = []
feature_names = []

for col in multi_cols:
    vals = users[col].apply(parse_list)
    mlb = MultiLabelBinarizer()
    arr = mlb.fit_transform(vals)
    parts.append(sparse.csr_matrix(arr, dtype=np.float32))
    feature_names += [f"{col}_{v}" for v in mlb.classes_]

for col in single_cols:
    vals = users[col].apply(lambda x: parse_list(x)[0] if parse_list(x) else "missing")
    cats = sorted(vals.unique())
    idx = {c:i for i,c in enumerate(cats)}
    rows = np.arange(len(vals))
    cols = np.array([idx[v] for v in vals])
    parts.append(sparse.csr_matrix((np.ones(len(vals), dtype=np.float32), (rows, cols)), shape=(len(vals), len(cats))))
    feature_names += [f"{col}_{c}" for c in cats]

X = sparse.hstack(parts, format="csr", dtype=np.float32)
norm = np.sqrt(X.multiply(X).sum(axis=1)).A1
norm[norm == 0] = 1
X = X.multiply((1 / norm)[:, None]).tocsr()

rows = []
for ui, row in users[["yes_swipes", "no_swipes"]].iterrows():
    for col, label in [("yes_swipes", 1.0), ("no_swipes", -1.0)]:
        for d in parse_list(row[col]):
            d = int(d)
            if 0 <= d < len(mapping):
                rows.append((ui, d, label))

inter = pd.DataFrame(rows, columns=["user_idx", "destination_id", "label"])
pos = inter[inter.label == 1.0]
neg = inter[inter.label == -1.0]

n = min(100000, len(pos), len(neg))
train = pd.concat([
    pos.sample(n=n, random_state=42),
    neg.sample(n=n, random_state=43)
], ignore_index=True).sample(frac=1, random_state=44)

user_rows = X[train.user_idx.to_numpy()]
row_idx = []
col_idx = []
values = []

for r, (u, d) in enumerate(zip(train.user_idx.to_numpy(), train.destination_id.to_numpy())):
    inds = user_rows[r].indices
    vals = user_rows[r].data
    row_idx.extend([r] * len(inds))
    col_idx.extend(int(d) * X.shape[1] + inds)
    values.extend(vals)

X_train = sparse.csr_matrix(
    (np.asarray(values, dtype=np.float32), (np.asarray(row_idx), np.asarray(col_idx))),
    shape=(len(train), len(mapping) * X.shape[1])
)

y = (train.label.to_numpy() == 1.0).astype(np.int8)

model = SGDClassifier(
    loss="log_loss",
    alpha=1e-5,
    max_iter=15,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y)

np.savez_compressed(
    os.path.join(MODEL, "recommender_weights.npz"),
    coef=model.coef_.astype(np.float32),
    intercept=model.intercept_.astype(np.float32)
)

with open(os.path.join(MODEL, "feature_schema.json"), "w", encoding="utf-8") as f:
    json.dump({"feature_names": feature_names}, f, indent=2)

print("Training complete")
