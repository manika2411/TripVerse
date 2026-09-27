const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}${url}`,
    {
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
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

export const getPosts = () => {
  return request("/community");
};

export const createPost = (post) => {
  return request("/community", {
    method: "POST",
    body: JSON.stringify(post),
  });
};

export const likePost = (id) => {
  return request(`/community/${id}/like`, {
    method: "PUT",
  });
};

export const addComment = (id, text) => {
  return request(
    `/community/${id}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ text }),
    }
  );
};

export const deletePost = (id) => {
  return request(`/community/${id}`, {
    method: "DELETE",
  });
};