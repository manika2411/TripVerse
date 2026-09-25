const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getExchangeRate = async (from, to) => {
  const response = await fetch(
    `${API_URL}/currency/rate?from=${encodeURIComponent(
      from,
    )}&to=${encodeURIComponent(to)}`,
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch exchange rate");
  }

  return result.data;
};
