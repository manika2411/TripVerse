// Typed errors so controllers can answer correctly WITHOUT echoing internal
// details (API keys, upstream messages) back to the browser.
class CountryInputError extends Error {}
class CountryNotFoundError extends Error {}

const API_BASE = "https://api.restcountries.com/countries/v5";

const API_KEY = process.env.REST_COUNTRIES_API_KEY;

const RESPONSE_FIELDS = [
  "names.common",
  "names.official",
  "codes.alpha_2",
  "codes.alpha_3",
  "capitals",
  "flag",
  "region",
  "subregion",
  "currencies",
].join(",");

const getHeaders = () => {
  if (!API_KEY) {
    throw new Error("REST_COUNTRIES_API_KEY is missing from backend .env");
  }

  return {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
  };
};

const normalizeCountry = (country) => {
  if (!country) return null;

  return {
    name: {
      common: country.names?.common || "",
      official: country.names?.official || "",
    },

    cca2: country.codes?.alpha_2 || "",

    cca3: country.codes?.alpha_3 || "",

    capital: Array.isArray(country.capitals)
      ? country.capitals.map((item) => item?.name).filter(Boolean)
      : [],

    flags: {
      png: country.flag?.url_png || "",
      svg: country.flag?.url_svg || "",
      emoji: country.flag?.emoji || "",
    },

    region: country.region || "",

    subregion: country.subregion || "",

    currencies: country.currencies || {},
  };
};

const requestCountries = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  const text = await response.text();

  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        `REST Countries returned invalid JSON (${response.status})`,
      );
    }
  }

  if (response.status === 404) {
    throw new CountryNotFoundError("Country not found");
  }

  if (!response.ok) {
    const message =
      result?.errors?.[0]?.message ||
      result?.message ||
      `REST Countries request failed (${response.status})`;

    throw new Error(message);
  }

  return result;
};

const COUNTRIES_TTL_MS = 6 * 60 * 60 * 1000; // country data rarely changes

let countriesCache = null;
let countriesCacheTime = 0;
let countriesInFlight = null;

const fetchAllCountries = async () => {
  const allCountries = [];

  const limit = 100;
  let offset = 0;

  while (true) {
    const url =
      `${API_BASE}` +
      `?limit=${limit}` +
      `&offset=${offset}` +
      `&response_fields=${encodeURIComponent(RESPONSE_FIELDS)}`;

    const result = await requestCountries(url);

    const countries = result?.data?.objects || [];

    allCountries.push(...countries);

    const meta = result?.data?.meta;

    if (countries.length === 0 || !meta?.more || countries.length < limit) {
      break;
    }

    offset += countries.length;
  }

  return allCountries.map(normalizeCountry).filter(Boolean);
};

// Cached + de-duplicated: concurrent requests share one upstream download, and
// a stale cache is served if the upstream API is temporarily unavailable.
const getCountries = async () => {
  const fresh =
    countriesCache && Date.now() - countriesCacheTime < COUNTRIES_TTL_MS;

  if (fresh) return countriesCache;

  if (!countriesInFlight) {
    countriesInFlight = fetchAllCountries()
      .then((countries) => {
        countriesCache = countries;
        countriesCacheTime = Date.now();
        return countries;
      })
      .catch((error) => {
        if (countriesCache) return countriesCache;
        throw error;
      })
      .finally(() => {
        countriesInFlight = null;
      });
  }

  return countriesInFlight;
};

const getCountryByCode = async (code) => {
  if (!code) {
    throw new CountryInputError("Country code is required");
  }

  const cleanCode = String(code).trim().toUpperCase();

  const url =
    `${API_BASE}/codes.alpha_3/${encodeURIComponent(cleanCode)}` +
    `?response_fields=${encodeURIComponent(RESPONSE_FIELDS)}`;

  const result = await requestCountries(url);

  const country = result?.data?.objects?.[0];

  if (!country) {
    throw new CountryNotFoundError("Country not found");
  }

  return normalizeCountry(country);
};

const getCountryByName = async (name) => {
  if (!name) {
    throw new CountryInputError("Country name is required");
  }

  const cleanName = String(name).trim();

  const url =
    `${API_BASE}/names.common/${encodeURIComponent(cleanName)}` +
    `?response_fields=${encodeURIComponent(RESPONSE_FIELDS)}`;

  const result = await requestCountries(url);

  const country = result?.data?.objects?.[0];

  if (!country) {
    throw new CountryNotFoundError("Country not found");
  }

  return normalizeCountry(country);
};

module.exports = {
  CountryInputError,
  CountryNotFoundError,
  getCountries,
  getCountryByCode,
  getCountryByName,
};
