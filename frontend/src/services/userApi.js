const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const parseResponse = async (response) => {
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
    throw new Error(result.message || `Request failed (${response.status})`);
  }

  return result?.data || result;
};

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: getHeaders(),
  });

  return parseResponse(response);
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(profileData),
  });

  return parseResponse(response);
};
