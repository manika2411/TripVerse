const { getCountries } = require("./countryService");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

const CACHE_DURATION = 5 * 60 * 1000;
const CANDIDATE_COUNT = 50;
const RESULT_COUNT = 10;

let countryCache = null;
let countryCacheTime = 0;

const COUNTRY_ALIASES = {
  turkey: "türkiye",
  "czech republic": "czechia",
  "united states of america": "united states",
  usa: "united states",
  uk: "united kingdom",
  uae: "united arab emirates",
  "viet nam": "vietnam"
};

const normalizeCountry = (country) => {
  const value = String(country || "")
    .trim()
    .toLowerCase();

  return COUNTRY_ALIASES[value] || value;
};

const getAvailableCountries = async () => {
  const now = Date.now();

  if (
    countryCache &&
    now - countryCacheTime < CACHE_DURATION
  ) {
    return countryCache;
  }

  const countries = await getCountries();

  if (!Array.isArray(countries)) {
    throw new Error("Country service returned invalid data");
  }

  const names = countries
    .map((country) => {
      if (typeof country.name === "string") {
        return country.name;
      }

      return country.name?.common || country.name?.official;
    })
    .filter(Boolean)
    .map(normalizeCountry);

  countryCache = new Set(names);
  countryCacheTime = now;

  console.log("Country cache refreshed:", countryCache.size);

  countryCacheTime = now;
  return countryCache;
};

const getRecommendations = async (preferences) => {
  const response = await fetch(`${ML_SERVICE_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...preferences,
      top_k: CANDIDATE_COUNT
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "ML recommendation service failed"
    );
  }

  const candidates = data.recommendations || [];
  const availableCountries = await getAvailableCountries();

  const validCandidates = candidates
    .filter((recommendation) =>
      availableCountries.has(
        normalizeCountry(recommendation.country)
      )
    )
    .sort((a, b) => b.score - a.score);

  console.log("ML candidates received:", candidates.length);
  console.log("Available countries:", availableCountries.size);
  console.log("Candidates passing country validation:", validCandidates.length);

  const validRecommendations = validCandidates.slice(
    0,
    RESULT_COUNT
  );

  const scores = validRecommendations.map(
    (recommendation) => recommendation.score
  );

  const minimum = scores.length ? Math.min(...scores) : 0;
  const maximum = scores.length ? Math.max(...scores) : 0;

  const recommendations = validRecommendations.map(
    (recommendation) => ({
      ...recommendation,
      matchScore:
        maximum > minimum
          ? Number(
              (
                ((recommendation.score - minimum) /
                  (maximum - minimum)) *
                100
              ).toFixed(2)
            )
          : 100
    })
  );

  return {
    success: true,
    count: recommendations.length,
    recommendations
  };
};

module.exports = {
  getRecommendations
};