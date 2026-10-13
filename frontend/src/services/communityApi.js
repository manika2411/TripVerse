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

// Cursor pagination: pass the `nextCursor` from the previous response as `before`.
// Resolves to { data: Post[], pagination: { limit, hasMore, nextCursor } }.
//
// Always returns that shape, even if the server answers with something else
// (for example an older backend that still returns a bare array), so the page
// can never receive `undefined` posts.
export const getPosts = async ({ before, limit = 10 } = {}) => {
  const params = new URLSearchParams({ limit: String(limit) });

  if (before) params.set("before", before);

  const result = await request(`/community?${params.toString()}`);

  // Older backend: a plain array with no pagination support.
  if (Array.isArray(result)) {
    return {
      data: result,
      pagination: { limit, hasMore: false, nextCursor: null },
    };
  }

  const nextCursor = result?.pagination?.nextCursor || null;

  return {
    data: Array.isArray(result?.data) ? result.data : [],
    pagination: {
      limit: result?.pagination?.limit || limit,
      hasMore: Boolean(result?.pagination?.hasMore && nextCursor),
      nextCursor,
    },
  };
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