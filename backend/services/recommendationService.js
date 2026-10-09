const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

const getRecommendations = async (preferences) => {
  const response = await fetch(`${ML_SERVICE_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "ML recommendation service failed");
  }

  return data;
};

module.exports = {
  getRecommendations,
};