// Cart API helpers for the frontend.
const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

// Sends JSON requests to the cart backend APIs.
const handleApi = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
};

// Builds the required userId query parameter.
const buildUserParam = (userId) => {
  if (!userId) throw new Error("userId is required for cart operations");
  return `userId=${encodeURIComponent(userId)}`;
};

// Fetches the current user's cart items.
export const fetchCartApi = async (userId) => {
  const data = await handleApi(`/api/cart?${buildUserParam(userId)}`);
  return data.items || [];
};

// Adds an item to the cart through the backend API.
export const addCartItemApi = async (userId, bookId, quantity = 1) => {
  const data = await handleApi(`/api/cart`, {
    method: "POST",
    body: JSON.stringify({ userId, bookId, quantity }),
  });
  return data.items || [];
};

// Updates a cart item quantity through the backend API.
export const updateCartItemApi = async (userId, bookId, quantity) => {
  const data = await handleApi(`/api/cart/${bookId}`, {
    method: "PUT",
    body: JSON.stringify({ userId, quantity }),
  });
  return data.items || [];
};

// Deletes a cart item through the backend API.
export const deleteCartItemApi = async (userId, bookId) => {
  const data = await handleApi(`/api/cart/${bookId}?${buildUserParam(userId)}`, {
    method: "DELETE",
  });
  return data.items || [];
};

// Clears the user's cart through the backend API.
export const clearCartApi = async (userId) => {
  const data = await handleApi(`/api/cart?${buildUserParam(userId)}`, {
    method: "DELETE",
  });
  return data.items || [];
};
