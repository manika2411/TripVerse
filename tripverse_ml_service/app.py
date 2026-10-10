from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
import json
import os
from typing import List, Optional, Union

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")
DATA_DIR = os.path.join(BASE_DIR, "data")

WEIGHTS_PATH = os.path.join(MODEL_DIR, "recommender_weights.npz")
SCHEMA_PATH = os.path.join(MODEL_DIR, "schema.json")
MAPPING_PATH = os.path.join(DATA_DIR, "destination_mapping.csv")

app = FastAPI(
    title="TripVerse Recommendation API",
    version="1.1.0"
)

if not os.path.exists(WEIGHTS_PATH):
    raise RuntimeError(f"Model weights not found: {WEIGHTS_PATH}")

if not os.path.exists(SCHEMA_PATH):
    raise RuntimeError(f"Model schema not found: {SCHEMA_PATH}")

if not os.path.exists(MAPPING_PATH):
    raise RuntimeError(f"Destination mapping not found: {MAPPING_PATH}")

weights = np.load(WEIGHTS_PATH)

coef = weights["coef"].astype(np.float32)
intercept = weights["intercept"].astype(np.float32)

with open(SCHEMA_PATH, "r", encoding="utf-8") as file:
    schema = json.load(file)

destination_mapping = pd.read_csv(MAPPING_PATH)

FEATURE_NAMES = schema["feature_names"]
FEATURE_COUNT = len(FEATURE_NAMES)

required_columns = {
    "destination_id",
    "destination",
    "api_country"
}

missing_columns = required_columns - set(destination_mapping.columns)

if missing_columns:
    raise RuntimeError(
        f"Destination mapping is missing columns: {sorted(missing_columns)}"
    )

if coef.shape[1] != len(destination_mapping) * FEATURE_COUNT:
    raise RuntimeError(
        f"Model shape mismatch. Expected "
        f"{len(destination_mapping) * FEATURE_COUNT} features "
        f"but found {coef.shape[1]}."
    )

COEF_MATRIX = coef.reshape(
    coef.shape[0],
    len(destination_mapping),
    FEATURE_COUNT
)[0]

MODEL_INTERCEPT = float(intercept[0])

FIELD_OPTIONS = {
    "form_a": {
        "0": "0-19",
        "1": "20-39",
        "2": "40-59",
        "3": "60+"
    },
    "form_f": {
        "0": "Beach",
        "1": "Adventure",
        "2": "Nature",
        "3": "Culture",
        "4": "Nightlife",
        "5": "History",
        "6": "Shopping",
        "7": "Cuisine"
    },
    "form_g": {
        "0": "Urban",
        "1": "Rural",
        "2": "Sea",
        "3": "Mountain",
        "4": "Lake",
        "5": "Desert",
        "6": "Plains",
        "7": "Jungle"
    },
    "form_rr": {
        "e": "Europe",
        "n": "N. America",
        "c": "Caribbean",
        "a": "Asia",
        "s": "S. America",
        "m": "Mid. East",
        "f": "Africa",
        "o": "Oceania"
    },
    "form_b": {
        "0": "$0-$49",
        "1": "$50-$99",
        "2": "$100-$249",
        "3": "$300+"
    },
    "form_c": {
        "0": "Winter",
        "1": "Spring",
        "2": "Summer",
        "3": "Fall"
    },
    "form_h": {
        "0": "Chill & Relaxed",
        "1": "Balanced",
        "2": "Active"
    },
    "form_i": {
        "0": "Very Safety Conscious",
        "1": "Balanced",
        "2": "Ready for Anything"
    },
    "form_j": {
        "0": "Off the Beaten Path",
        "1": "Classic Spot",
        "2": "Mainstream & Trendy"
    },
    "form_r": {
        "0": "Anywhere",
        "1": "Specific Regions"
    }
}

LABEL_TO_CODE = {
    field: {
        str(label).strip().lower(): str(code)
        for code, label in options.items()
    }
    for field, options in FIELD_OPTIONS.items()
}

REGION_COUNTRIES = {
    "e": {
        "Albania", "Andorra", "Austria", "Belarus", "Belgium",
        "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus",
        "Czechia", "Denmark", "Estonia", "Finland", "France",
        "Germany", "Greece", "Hungary", "Iceland", "Ireland",
        "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania",
        "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro",
        "Netherlands", "North Macedonia", "Norway", "Poland",
        "Portugal", "Romania", "Russia", "San Marino", "Serbia",
        "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland",
        "Ukraine", "United Kingdom", "Vatican City", "Türkiye"
    },
    "n": {
        "Canada", "United States", "Mexico"
    },
    "c": {
        "Antigua and Barbuda", "Bahamas", "Barbados", "Cuba",
        "Dominica", "Dominican Republic", "Grenada", "Haiti",
        "Jamaica", "Saint Kitts and Nevis", "Saint Lucia",
        "Saint Vincent and the Grenadines", "Trinidad and Tobago",
        "Puerto Rico"
    },
    "a": {
        "Afghanistan", "Armenia", "Azerbaijan", "Bahrain",
        "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China",
        "Georgia", "India", "Indonesia", "Iran", "Iraq", "Israel",
        "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan",
        "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia",
        "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan",
        "Palestine", "Philippines", "Qatar", "Saudi Arabia",
        "Singapore", "South Korea", "Sri Lanka", "Syria",
        "Taiwan", "Tajikistan", "Thailand", "Timor-Leste",
        "Turkmenistan", "United Arab Emirates", "Uzbekistan",
        "Vietnam", "Yemen", "Türkiye", "Russia"
    },
    "s": {
        "Argentina", "Bolivia", "Brazil", "Chile", "Colombia",
        "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname",
        "Uruguay", "Venezuela"
    },
    "m": {
        "Bahrain", "Egypt", "Iran", "Iraq", "Israel", "Jordan",
        "Kuwait", "Lebanon", "Oman", "Palestine", "Qatar",
        "Saudi Arabia", "Syria", "Türkiye",
        "United Arab Emirates", "Yemen"
    },
    "f": {
        "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso",
        "Burundi", "Cabo Verde", "Cameroon", "Central African Republic",
        "Chad", "Comoros", "Democratic Republic of the Congo",
        "Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea",
        "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana",
        "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho",
        "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania",
        "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
        "Nigeria", "Rwanda", "Senegal", "Seychelles", "Sierra Leone",
        "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania",
        "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
    },
    "o": {
        "Australia", "Fiji", "Kiribati", "Marshall Islands",
        "Micronesia", "Nauru", "New Zealand", "Palau",
        "Papua New Guinea", "Samoa", "Solomon Islands",
        "Tonga", "Tuvalu", "Vanuatu"
    }
}

COUNTRY_ALIASES = {
    "united states of america": "united states",
    "usa": "united states",
    "uk": "united kingdom",
    "czech republic": "czechia",
    "turkey": "türkiye",
    "uae": "united arab emirates",
    "ivory coast": "ivory coast",
    "viet nam": "vietnam",
    "the bahamas": "bahamas"
}

NORMALIZED_REGION_COUNTRIES = {
    region: {
        COUNTRY_ALIASES.get(country.strip().lower(), country.strip().lower())
        for country in countries
    }
    for region, countries in REGION_COUNTRIES.items()
}


class RecommendationRequest(BaseModel):
    form_a: Union[str, List[str], None] = None
    form_b: Optional[str] = None
    form_c: Optional[str] = None
    form_f: List[str] = Field(default_factory=list)
    form_g: List[str] = Field(default_factory=list)
    form_h: Optional[str] = None
    form_i: Optional[str] = None
    form_j: Optional[str] = None
    form_r: Optional[str] = None
    form_rr: List[str] = Field(default_factory=list)
    top_k: int = Field(default=10, ge=1, le=50)
    allowed_countries: Optional[List[str]] = None
    exclude_destinations: List[str] = Field(default_factory=list)


def normalize_country(country):
    country = str(country).strip().lower()
    return COUNTRY_ALIASES.get(country, country)


def normalize_value(field, value):
    if value is None:
        return None

    value = str(value).strip()

    if value in FIELD_OPTIONS.get(field, {}):
        return value

    return LABEL_TO_CODE.get(field, {}).get(value.lower())


def normalize_list(field, values):
    if values is None:
        return []

    if isinstance(values, str):
        values = [values]

    result = []

    for value in values:
        code = normalize_value(field, value)

        if code is not None and code not in result:
            result.append(code)

    return result


def build_feature_vector(request):
    vector = np.zeros(FEATURE_COUNT, dtype=np.float32)
    feature_index = {
        name: index for index, name in enumerate(FEATURE_NAMES)
    }

    form_a_values = request.form_a

    if isinstance(form_a_values, str):
        form_a_values = [form_a_values]

    for value in normalize_list("form_a", form_a_values):
        name = f"form_a_{value}"
        if name in feature_index:
            vector[feature_index[name]] = 1.0

    for field in ["form_f", "form_g", "form_rr"]:
        for value in normalize_list(field, getattr(request, field)):
            name = f"{field}_{value}"
            if name in feature_index:
                vector[feature_index[name]] = 1.0

    for field in ["form_b", "form_c", "form_h", "form_i", "form_j", "form_r"]:
        value = normalize_value(field, getattr(request, field))

        if value is None:
            value = "missing"

        name = f"{field}_{value}"
        if name in feature_index:
            vector[feature_index[name]] = 1.0

    norm = np.linalg.norm(vector)

    if norm > 0:
        vector = vector / norm

    return vector


def filter_by_regions(result, selected_regions):
    if not selected_regions:
        return result

    allowed_countries = set()

    for region in selected_regions:
        allowed_countries.update(
            NORMALIZED_REGION_COUNTRIES.get(region, set())
        )

    if not allowed_countries:
        return result.iloc[0:0]

    normalized_countries = result["api_country"].map(normalize_country)

    return result[normalized_countries.isin(allowed_countries)]


@app.get("/")
def root():
    return {
        "success": True,
        "service": "TripVerse Recommendation API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "model_loaded": True,
        "destinations": len(destination_mapping),
        "features": FEATURE_COUNT
    }


@app.post("/recommend")
def recommend(request: RecommendationRequest):
    try:
        vector = build_feature_vector(request)
        scores = COEF_MATRIX @ vector + MODEL_INTERCEPT

        result = destination_mapping.copy()
        result["score"] = scores

        selected_regions = normalize_list("form_rr", request.form_rr)
        result = filter_by_regions(result, selected_regions)

        if request.allowed_countries:
            allowed = {
                normalize_country(country)
                for country in request.allowed_countries
            }

            result = result[
                result["api_country"]
                .map(normalize_country)
                .isin(allowed)
            ]

        if request.exclude_destinations:
            excluded = {
                str(destination).strip().lower()
                for destination in request.exclude_destinations
            }

            result = result[
                ~result["destination"]
                .astype(str)
                .str.strip()
                .str.lower()
                .isin(excluded)
            ]

        result = result.sort_values(
            "score",
            ascending=False
        ).head(request.top_k)

        recommendations = []
        score_values = result["score"].to_numpy()

        if len(score_values) > 0:
            minimum = float(score_values.min())
            maximum = float(score_values.max())

            if maximum > minimum:
                normalized_scores = (
                    (score_values - minimum) / (maximum - minimum)
                )
            else:
                normalized_scores = np.ones(len(score_values))
        else:
            normalized_scores = []

        for index, (_, row) in enumerate(result.iterrows()):
            recommendations.append({
                "destinationId": int(row["destination_id"]),
                "destination": str(row["destination"]),
                "country": str(row["api_country"]),
                "score": round(float(row["score"]), 6),
                "matchScore": round(
                    float(normalized_scores[index] * 100), 2
                )
            })

        return {
            "success": True,
            "count": len(recommendations),
            "recommendations": recommendations
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
