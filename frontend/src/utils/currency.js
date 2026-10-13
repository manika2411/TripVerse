const CODE_REGEX = /^[A-Za-z]{3}$/;

export const isValidCurrencyCode = (code) =>
  typeof code === "string" && CODE_REGEX.test(code.trim());

/**
 * Format an amount in its own currency, e.g. 3000 + "EUR" -> "€3,000",
 * 500 + "MXN" -> "$500". Amounts with an unknown currency are shown as plain
 * numbers rather than being given a wrong symbol.
 */
export const formatMoney = (amount, currencyCode) => {
  const value = Number(amount) || 0;

  if (!isValidCurrencyCode(currencyCode)) {
    return value.toLocaleString("en", { maximumFractionDigits: 2 });
  }

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode.trim().toUpperCase(),
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode.toUpperCase()} ${value.toLocaleString("en")}`;
  }
};

/** "EUR" -> "€", "MXN" -> "$", "CHF" -> "CHF". Empty string if the code is invalid. */
export const getCurrencySymbolFromCode = (currencyCode) => {
  if (!isValidCurrencyCode(currencyCode)) return "";

  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode.trim().toUpperCase(),
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);

    return parts.find((part) => part.type === "currency")?.value || currencyCode.toUpperCase();
  } catch {
    return currencyCode.toUpperCase();
  }
};
