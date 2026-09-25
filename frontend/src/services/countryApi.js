const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getCountries = async () => {
  const response = await fetch(`${API_URL}/countries`);

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load countries");
  }

  return result.data;
};

export const getAllCountries = async () => {
  return getCountries();
};

export const getCountryByCode = async (code) => {
  const response = await fetch(
    `${API_URL}/countries/code/${encodeURIComponent(code)}`
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load country");
  }

  return result.data;
};

export const getCountryByName = async (name) => {
  const response = await fetch(
    `${API_URL}/countries/name/${encodeURIComponent(name)}`
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load country");
  }

  return result.data;
};