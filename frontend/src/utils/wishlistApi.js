// Wishlist API helpers for backend-backed wishlist operations.
const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";

// Normalizes an ID into a positive integer.
const normalizeId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

// Validates and resolves a required numeric ID.
const requireId = (value, label) => {
  const normalized = normalizeId(value);
  if (!normalized) {
    throw new Error(`${label} is required`);
  }
  return normalized;
};

// Mirrors wishlist data into local storage and emits an update event.
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

// Sends JSON requests to the wishlist backend APIs.
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

// Fetches the current user's wishlist items.
export const fetchWishlistApi = async (userId) => {
  const normalizedUserId = requireId(userId, "userId");
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(normalizedUserId)}`, {
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

// Adds a wishlist item through the backend API.
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

// Updates a wishlist item through the backend API.
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

// Deletes a wishlist item through the backend API.
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

// Clears the user's wishlist through the backend API.
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
