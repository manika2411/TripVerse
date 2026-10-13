/**
 * Budget controller tests.
 * Run with:  node --test tests/
 *
 * No MongoDB needed: the real controller and the real Mongoose model (including
 * its pre("validate") hook) run; only the two DB round-trips are stubbed.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const Budget = require("../models/Budget");
const { saveBudget, getBudgets } = require("../controllers/budgetController");

const USER_ID = new mongoose.Types.ObjectId();

const makeRes = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

// Stub the DB layer. `existing` is what findOne() returns, in order.
const stubDb = (existing = []) => {
  const queue = [...existing];
  const saved = [];
  const originalFindOne = Budget.findOne;
  const originalSave = Budget.prototype.save;

  Budget.findOne = async () => (queue.length ? queue.shift() : null);
  Budget.prototype.save = async function () {
    await this.validate(); // runs the real pre("validate") hook + schema rules
    saved.push(this);
    return this;
  };

  return {
    saved,
    restore() {
      Budget.findOne = originalFindOne;
      Budget.prototype.save = originalSave;
    },
  };
};

const call = async (body, existing) => {
  const db = stubDb(existing);
  const res = makeRes();
  try {
    await saveBudget({ body, user: { _id: USER_ID } }, res);
  } finally {
    db.restore();
  }
  return { res, db };
};

const baseBody = {
  destination: "France",
  destinationCode: "fra",
  currency: "eur",
  budget: 3000,
};

test("nested expenses payload: totals and remaining are correct", async () => {
  const { res } = await call({
    ...baseBody,
    expenses: { accommodation: 1000, food: 500, transport: 300, activities: 200, shopping: 100, other: 100 },
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.data.totalExpenses, 2200);
  assert.equal(res.body.data.remainingBudget, 800);
  assert.equal(res.body.data.expenses.accommodation, 1000);
  assert.equal(res.body.data.destinationCode, "FRA");
  assert.equal(res.body.data.currency, "EUR");
});

test("REGRESSION: flat-field payload (what the rewritten planner sent) no longer zeroes expenses", async () => {
  const { res } = await call({
    ...baseBody,
    accommodation: 1000, food: 500, transport: 300, activities: 200, shopping: 100, other: 100,
    totalExpenses: 9999, remainingBudget: 9999, // client-sent derived values must be ignored
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.data.totalExpenses, 2200);
  assert.equal(res.body.data.remainingBudget, 800);
});

test("rejects the placeholder currency '0' (the 'Currency: 0' bug)", async () => {
  const { res, db } = await call({ ...baseBody, currency: "0" });
  assert.equal(res.statusCode, 400);
  assert.equal(db.saved.length, 0);
});

test("rejects missing destinationCode", async () => {
  const { res } = await call({ ...baseBody, destinationCode: undefined });
  assert.equal(res.statusCode, 400);
});

test("rejects expenses above budget", async () => {
  const { res } = await call({ ...baseBody, budget: 100, expenses: { food: 150 } });
  assert.equal(res.statusCode, 400);
});

test("ignores negative / junk expense values", async () => {
  const { res } = await call({ ...baseBody, expenses: { food: -50, transport: "abc", other: 20 } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.data.totalExpenses, 20);
  assert.equal(res.body.data.remainingBudget, 2980);
});

test("re-saving updates the existing doc instead of creating a new one", async () => {
  const existing = new Budget({
    user: USER_ID, destination: "France", destinationCode: "FRA", currency: "EUR", budget: 3000,
    expenses: { food: 100 },
  });

  const { res, db } = await call({ ...baseBody, expenses: { food: 400 } }, [existing]);

  assert.equal(res.statusCode, 200);
  assert.equal(db.saved.length, 1);
  assert.equal(db.saved[0], existing, "same document instance was updated");
  assert.equal(res.body.data.totalExpenses, 400);
});

test("legacy doc without destinationCode is adopted, not duplicated", async () => {
  const legacy = new Budget({
    user: USER_ID, destination: "Mexico", destinationCode: "", currency: "0", budget: 500,
  });

  // 1st findOne (by code) -> null, 2nd findOne (legacy by name) -> legacy doc
  const { res, db } = await call(
    { destination: "Mexico", destinationCode: "MEX", currency: "MXN", budget: 500, expenses: { food: 120 } },
    [null, legacy],
  );

  assert.equal(res.statusCode, 200);
  assert.equal(db.saved[0], legacy);
  assert.equal(legacy.destinationCode, "MEX");
  assert.equal(legacy.currency, "MXN", "bad legacy currency '0' is repaired on re-save");
  assert.equal(res.body.data.remainingBudget, 380);
});

test("getBudgets returns recomputed totals even when stored totals are stale", async () => {
  const stale = new Budget({
    user: USER_ID, destination: "France", destinationCode: "FRA", currency: "EUR", budget: 3000,
    expenses: { accommodation: 1000, food: 500 },
    totalExpenses: 3000, remainingBudget: 0, // stale / wrong values as stored in legacy data
  });

  const originalFind = Budget.find;
  Budget.find = () => ({ sort: async () => [stale] });
  const res = makeRes();
  try {
    await getBudgets({ user: { _id: USER_ID } }, res);
  } finally {
    Budget.find = originalFind;
  }

  assert.equal(res.body.data[0].totalExpenses, 1500);
  assert.equal(res.body.data[0].remainingBudget, 1500);
});
