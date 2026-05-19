// Order API helpers for checkout and order tracking flows.
const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

// Normalizes an ID into a positive integer.
const normalizeId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

// Sends JSON requests to the order backend APIs.
const handleApi = async (path, options = {}) => {
  const { headers = {}, ...restOptions } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
};

// Creates a new order through the backend API.
export const createOrderApi = async (payload) => {
  const normalizedUserId = normalizeId(payload?.userId);
  if (!normalizedUserId) throw new Error("userId is required to create an order");

  const body = {
    userId: normalizedUserId,
    items: payload.items,
    shipping: payload.shipping,
    shippingMethod: payload.shippingMethod,
    shippingCost: payload.shippingCost,
  };

  const data = await handleApi(`/api/orders`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "x-user-id": normalizedUserId,
    },
  });

  return data.order;
};

// Fetches the current user's orders.
export const getOrdersApi = async (userId) => {
  const normalizedUserId = normalizeId(userId);
  const data = await handleApi(`/api/orders?userId=${encodeURIComponent(normalizedUserId)}`, {
    headers: {
      "x-user-id": normalizedUserId,
    },
  });
  return data.orders || [];
};

// Fetches a single order for the current user.
export const getOrderApi = async (userId, orderId) => {
  const normalizedUserId = normalizeId(userId);
  const data = await handleApi(`/api/orders/${orderId}?userId=${encodeURIComponent(normalizedUserId)}`, {
    headers: {
      "x-user-id": normalizedUserId,
    },
  });
  return data.order;
};

// Updates tracking details for an order.
export const updateOrderTrackingApi = async (orderId, payload) => {
  const data = await handleApi(`/api/orders/${orderId}/tracking`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.order;
};
