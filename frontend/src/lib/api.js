export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiRequest = async (path, options = {}) => {
  const { token, body, headers = {}, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getGames = () => apiRequest("/games");

export const registerUser = (body) =>
  apiRequest("/auth/register", {
    method: "POST",
    body,
  });

export const loginUser = (body) =>
  apiRequest("/auth/login", {
    method: "POST",
    body,
  });

export const getMe = (token) => apiRequest("/users/me", { token });

export const submitScore = (token, body) =>
  apiRequest("/scores", {
    method: "POST",
    token,
    body,
  });
