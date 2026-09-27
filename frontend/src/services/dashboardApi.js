const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getDashboardData = async () => {
  const [budgetsResponse, tripsResponse] =
    await Promise.all([
      fetch(`${API_URL}/budgets`, {
        headers: getHeaders(),
      }),
      fetch(`${API_URL}/trips`, {
        headers: getHeaders(),
      }),
    ]);

  const budgetsResult = await budgetsResponse.json();
  const tripsResult = await tripsResponse.json();

  if (!budgetsResponse.ok || !budgetsResult.success) {
    throw new Error(
      budgetsResult.message || "Failed to load budgets"
    );
  }

  if (!tripsResponse.ok) {
    throw new Error(
      tripsResult.message || "Failed to load trips"
    );
  }

  return {
    budgets: budgetsResult.data || [],
    trips: Array.isArray(tripsResult)
      ? tripsResult
      : tripsResult.data || [],
  };
};