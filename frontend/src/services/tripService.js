const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status})`
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed (${response.status})`
    );
  }

  return data;
};

export const getTrips = async () => {
  return request("/trips");
};

export const getTripById = async (id) => {
  return request(`/trips/${id}`);
};

export const createTrip = async (tripData) => {
  return request("/trips", {
    method: "POST",
    body: JSON.stringify(tripData),
  });
};

export const updateTrip = async (id, tripData) => {
  return request(`/trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(tripData),
  });
};

export const deleteTrip = async (id) => {
  return request(`/trips/${id}`, {
    method: "DELETE",
  });
};