const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const saveBudget = async (budgetData) => {
  const response = await fetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to save budget");
  }

  return result.data;
};

export const getBudgets = async () => {
  const response = await fetch(`${API_URL}/budgets`, {
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load budgets");
  }

  return result.data;
};

export const getBudgetByDestination = async (code) => {
  const response = await fetch(
    `${API_URL}/budgets/destination/${encodeURIComponent(code)}`,
    {
      headers: getAuthHeaders(),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load budget");
  }

  return result.data;
};

export const deleteBudget = async (id) => {
  const response = await fetch(`${API_URL}/budgets/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete budget");
  }

  return result;
};
