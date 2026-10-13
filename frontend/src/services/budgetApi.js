const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const parse = async (response) => {
  const text = await response.text();
  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(`Server returned an invalid response (${response.status})`);
    }
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

// Create or update (the server matches on user + destinationCode).
export const saveBudget = async (payload) =>
  parse(
    await fetch(`${API_URL}/budgets`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    }),
  );

export const getBudgetByDestination = async (code) =>
  parse(
    await fetch(`${API_URL}/budgets/destination/${encodeURIComponent(code)}`, {
      headers: headers(),
    }),
  );

export const deleteBudget = async (id) =>
  parse(
    await fetch(`${API_URL}/budgets/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: headers(),
    }),
  );
