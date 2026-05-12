const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

const normalizeId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

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

export const getOrdersApi = async (userId) => {
  const normalizedUserId = normalizeId(userId);
  const data = await handleApi(`/api/orders?userId=${encodeURIComponent(normalizedUserId)}`, {
    headers: {
      "x-user-id": normalizedUserId,
    },
  });
  return data.orders || [];
};

export const getOrderApi = async (userId, orderId) => {
  const normalizedUserId = normalizeId(userId);
  const data = await handleApi(`/api/orders/${orderId}?userId=${encodeURIComponent(normalizedUserId)}`, {
    headers: {
      "x-user-id": normalizedUserId,
    },
  });
  return data.order;
};

export const updateOrderTrackingApi = async (orderId, payload) => {
  const data = await handleApi(`/api/orders/${orderId}/tracking`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.order;
};
