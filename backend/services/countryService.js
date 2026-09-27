// const API_BASE = "https://api.restcountries.com/countries/v5";

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

  if (!response.ok) {
    const message =
      result?.errors?.[0]?.message ||
      result?.message ||
      `REST Countries request failed (${response.status})`;

    throw new Error(message);
  }

  return result;
};

const getCountries = async () => {
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

const getCountryByCode = async (code) => {
  if (!code) {
    throw new Error("Country code is required");
  }

  const cleanCode = String(code).trim().toUpperCase();

  const url =
    `${API_BASE}/codes.alpha_3/${encodeURIComponent(cleanCode)}` +
    `?response_fields=${encodeURIComponent(RESPONSE_FIELDS)}`;

  const result = await requestCountries(url);

  const country = result?.data?.objects?.[0];

  if (!country) {
    throw new Error(`Country not found: ${cleanCode}`);
  }

  return normalizeCountry(country);
};

const getCountryByName = async (name) => {
  if (!name) {
    throw new Error("Country name is required");
  }

  const cleanName = String(name).trim();

  const url =
    `${API_BASE}/names.common/${encodeURIComponent(cleanName)}` +
    `?response_fields=${encodeURIComponent(RESPONSE_FIELDS)}`;

  const result = await requestCountries(url);

  const country = result?.data?.objects?.[0];

  if (!country) {
    throw new Error(`Country not found: ${cleanName}`);
  }

  return normalizeCountry(country);
};

module.exports = {
  getCountries,
  getCountryByCode,
  getCountryByName,
};
