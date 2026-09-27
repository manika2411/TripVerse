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

export const getCurrencyInfo = (country) => {
  if (!country) return null;

  const raw = country.currency;

  // Some backend country records use 0 as a placeholder.
  // Never treat that placeholder as a real currency code.

  if (typeof raw === "string" && raw.trim()) {
    const code = raw.trim().toUpperCase();
    return {
      code,
      name: code,
      symbol: CURRENCY_SYMBOLS[code] || code,
    };
  }

  if (raw && typeof raw === "object") {
    if (raw.code || raw.symbol || raw.name) {
      const code = String(raw.code || "").toUpperCase();
      if (code === "0") return null;
      return {
        code: code || "",
        name: raw.name || code || "Local currency",
        symbol: raw.symbol || CURRENCY_SYMBOLS[code] || code || "¤",
      };
    }

    const rawCode = Object.keys(raw)[0];
    if (rawCode) {
      const item = raw[rawCode];
      const code = rawCode.toUpperCase();
      return {
        code,
        name: item?.name || code,
        symbol: item?.symbol || CURRENCY_SYMBOLS[code] || code,
      };
    }
  }

  const currencies = country.currencies;

  if (currencies && typeof currencies === "object") {
    const code = Object.keys(currencies)[0];

    if (code) {
      const item = currencies[code];
      const normalizedCode = code.toUpperCase();

      if (typeof item === "string") {
        return {
          code: normalizedCode,
          name: item,
          symbol: CURRENCY_SYMBOLS[normalizedCode] || normalizedCode,
        };
      }

      return {
        code: normalizedCode,
        name: item?.name || normalizedCode,
        symbol:
          item?.symbol ||
          CURRENCY_SYMBOLS[normalizedCode] ||
          normalizedCode,
      };
    }
  }

  const fallbackCode =
    typeof country.currencyCode === "string"
      ? country.currencyCode
      : typeof country.currency_code === "string"
        ? country.currency_code
        : typeof country.currency?.code === "string"
          ? country.currency.code
          : "";

  const code = fallbackCode.trim().toUpperCase();

  if (code && code !== "0") {
    return {
      code,
      name: code,
      symbol: CURRENCY_SYMBOLS[code] || code,
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

// Async currency resolver used when the backend country payload does not
// contain usable currency metadata (for example, a numeric 0 placeholder).
export const getCurrencyInfoAsync = async (country) => {
  const localInfo = getCurrencyInfo(country);

  if (localInfo && localInfo.code && localInfo.code !== "0") {
    return localInfo;
  }

  const name = getCountryName(country);
  if (!name || name === "Unknown") return null;

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`,
    );

    if (!response.ok) return null;

    const data = await response.json();
    return getCurrencyInfo(data?.[0]) || null;
  } catch (error) {
    console.error("Currency fallback error:", error);
    return null;
  }
};
