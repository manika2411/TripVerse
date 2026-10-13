const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CURRENCY_SYMBOLS = {
  AED: "د.إ",
  AUD: "$",
  BDT: "৳",
  BRL: "R$",
  CAD: "$",
  CHF: "CHF",
  CNY: "¥",
  CZK: "Kč",
  DKK: "kr",
  EGP: "£",
  EUR: "€",
  GBP: "£",
  HKD: "$",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  INR: "₹",
  JPY: "¥",
  KRW: "₩",
  LKR: "Rs",
  MAD: "د.م.",
  MXN: "$",
  MYR: "RM",
  NGN: "₦",
  NOK: "kr",
  NZD: "$",
  PHP: "₱",
  PLN: "zł",
  PKR: "₨",
  QAR: "﷼",
  RUB: "₽",
  SAR: "﷼",
  SEK: "kr",
  SGD: "$",
  THB: "฿",
  TRY: "₺",
  TWD: "NT$",
  USD: "$",
  VND: "₫",
  ZAR: "R",
};

export const getCountryName = (country) => {
  if (typeof country?.name === "string") return country.name;
  return (
    country?.name?.common ||
    country?.names?.common ||
    "Unknown"
  );
};

export const getCountryCode = (country) => {
  return (
    country?.cca3 ||
    country?.codes?.alpha_3 ||
    country?.cca2 ||
    country?.codes?.alpha_2 ||
    country?.code ||
    ""
  );
};

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

// Normalise every currency shape we may receive into [{ code, name, symbol }].
//   REST Countries v5 (via our backend): [{ code: "MXN", name: "...", symbol: "$" }]
//   Legacy / v3 style:                    { MXN: { name: "...", symbol: "$" } }
//   Single object / plain string:         { code, name, symbol } | "MXN"
const toCurrencyEntries = (raw) => {
  if (!raw) return [];

  if (typeof raw === "string") return [{ code: raw }];

  if (Array.isArray(raw)) return raw.flatMap(toCurrencyEntries);

  if (typeof raw === "object") {
    if (typeof raw.code === "string") {
      return [{ code: raw.code, name: raw.name, symbol: raw.symbol }];
    }

    // Object keyed by currency code. Keys are only trusted when they are real
    // codes, so numeric array-style keys such as "0" can never leak through.
    return Object.entries(raw).map(([code, item]) => ({
      code,
      name: typeof item === "string" ? item : item?.name,
      symbol: typeof item === "object" ? item?.symbol : undefined,
    }));
  }

  return [];
};

export const getCurrencyInfo = (country) => {
  if (!country) return null;

  const candidates = [
    ...toCurrencyEntries(country.currencies),
    ...toCurrencyEntries(country.currency),
    ...toCurrencyEntries(country.currencyCode),
    ...toCurrencyEntries(country.currency_code),
  ];

  for (const entry of candidates) {
    const code = String(entry.code || "").trim().toUpperCase();

    if (!CURRENCY_CODE_REGEX.test(code)) continue;

    return {
      code,
      name: entry.name || code,
      symbol: entry.symbol || CURRENCY_SYMBOLS[code] || code,
    };
  }

  return null;
};

export const getCurrencyCode = (country) => {
  return getCurrencyInfo(country)?.code || "";
};

export const getCurrencySymbol = (country) => {
  return getCurrencyInfo(country)?.symbol || "—";
};

const getJson = async (response, fallback) => {
  const text = await response.text();
  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(`Server returned an invalid response (${response.status})`);
    }
  }

  if (!response.ok) {
    throw new Error(result.message || fallback);
  }

  if (result.success === false) {
    throw new Error(result.message || result.errors?.[0]?.message || fallback);
  }

  return result?.data ?? result;
};

export const getCountries = async () => {
  const response = await fetch(`${API_URL}/countries`);
  const data = await getJson(response, "Failed to load countries");

  if (!Array.isArray(data)) {
    throw new Error("Invalid country data received.");
  }

  return data;
};

export const getAllCountries = getCountries;

export const getCountryByCode = async (code) => {
  const response = await fetch(
    `${API_URL}/countries/code/${encodeURIComponent(code)}`,
  );

  return getJson(response, "Failed to load country");
};

export const getCountryByName = async (name) => {
  const response = await fetch(
    `${API_URL}/countries/name/${encodeURIComponent(name)}`,
  );

  return getJson(response, "Failed to load country");
};

// Async currency resolver. If the country object in hand has no usable
// currency data, ask our own backend for the full country record.
export const getCurrencyInfoAsync = async (country) => {
  const localInfo = getCurrencyInfo(country);

  if (localInfo) return localInfo;

  const code = getCountryCode(country);

  if (!code) return null;

  try {
    const fullCountry = await getCountryByCode(code);
    return getCurrencyInfo(fullCountry);
  } catch (error) {
    console.error("Currency fallback error:", error);
    return null;
  }
};
