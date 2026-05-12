const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

const normalizeId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const requireId = (value, label) => {
  const normalized = normalizeId(value);
  if (!normalized) {
    throw new Error(`${label} is required`);
  }
  return normalized;
};

const syncWishlistStorage = (userId, items) => {
  const normalizedUserId = normalizeId(userId);
  if (!normalizedUserId) return;

  try {
    localStorage.setItem(
      `wishlist_${normalizedUserId}`,
      JSON.stringify(Array.isArray(items) ? items : []),
    );
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  } catch (error) {
    console.error("Failed to sync wishlist storage", error);
  }
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

export const fetchWishlistApi = async (userId) => {
  const normalizedUserId = requireId(userId, "userId");
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(normalizedUserId)}`, {
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const addWishlistItemApi = async ({ userId, bookId, priority, notes }) => {
  const normalizedUserId = requireId(userId, "userId");
  const normalizedBookId = requireId(bookId, "bookId");

  const data = await handleApi(`/api/wishlist`, {
    method: "POST",
    body: JSON.stringify({
      userId: String(normalizedUserId),
      bookId: String(normalizedBookId),
      priority: priority === undefined || priority === null ? undefined : String(priority),
      notes,
    }),
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const updateWishlistItemApi = async ({ userId, bookId, priority, notes }) => {
  const normalizedUserId = requireId(userId, "userId");
  const normalizedBookId = requireId(bookId, "bookId");

  const data = await handleApi(`/api/wishlist/${normalizedBookId}`, {
    method: "PUT",
    body: JSON.stringify({
      userId: String(normalizedUserId),
      priority: priority === undefined || priority === null ? undefined : String(priority),
      notes,
    }),
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const deleteWishlistItemApi = async ({ userId, bookId }) => {
  const normalizedUserId = requireId(userId, "userId");
  const normalizedBookId = requireId(bookId, "bookId");

  const data = await handleApi(`/api/wishlist/${normalizedBookId}?userId=${encodeURIComponent(normalizedUserId)}`, {
    method: "DELETE",
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const clearWishlistApi = async (userId) => {
  const normalizedUserId = requireId(userId, "userId");
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(normalizedUserId)}`, {
    method: "DELETE",
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};
