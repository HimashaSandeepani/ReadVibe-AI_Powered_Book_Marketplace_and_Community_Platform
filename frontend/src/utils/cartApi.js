const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

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

const buildUserParam = (userId) => {
  if (!userId) throw new Error("userId is required for cart operations");
  return `userId=${encodeURIComponent(userId)}`;
};

export const fetchCartApi = async (userId) => {
  const data = await handleApi(`/api/cart?${buildUserParam(userId)}`);
  return data.items || [];
};

export const addCartItemApi = async (userId, bookId, quantity = 1) => {
  const data = await handleApi(`/api/cart`, {
    method: "POST",
    body: JSON.stringify({ userId, bookId, quantity }),
  });
  return data.items || [];
};

export const updateCartItemApi = async (userId, bookId, quantity) => {
  const data = await handleApi(`/api/cart/${bookId}`, {
    method: "PUT",
    body: JSON.stringify({ userId, quantity }),
  });
  return data.items || [];
};

export const deleteCartItemApi = async (userId, bookId) => {
  const data = await handleApi(`/api/cart/${bookId}?${buildUserParam(userId)}`, {
    method: "DELETE",
  });
  return data.items || [];
};

export const clearCartApi = async (userId) => {
  const data = await handleApi(`/api/cart?${buildUserParam(userId)}`, {
    method: "DELETE",
  });
  return data.items || [];
};
