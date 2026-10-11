const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getRecommendations = async (preferences) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to get personalized recommendations.");
  }

  const response = await fetch(`${API_URL}/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preferences),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || data.detail || "Unable to fetch recommendations."
    );
  }

  return data.recommendations || [];
};