// Live chat cache and API helpers for support conversations.
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const LIVE_CHAT_UPDATED_EVENT = "live-chat-updated";
let liveChatCache = [];

// Safely parses JSON with a fallback value.
const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

// Emits an update event for live chat consumers.
const emitLiveChatUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LIVE_CHAT_UPDATED_EVENT));
};

// Sends JSON requests to the live chat backend APIs.
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

// Returns the live chat update event name.
export const getLiveChatUpdatedEventName = () => LIVE_CHAT_UPDATED_EVENT;

// Builds the cache key for a live chat thread.
export const getLiveChatThreadKey = (orderId, userId) =>
  `CHAT-${orderId ?? "unknown"}-${userId ?? "unknown"}`;

// Normalizes a live chat thread into a consistent shape.
export const normalizeLiveChatThread = (thread) => ({
  ...thread,
  messages: Array.isArray(thread?.messages) ? thread.messages : [],
});

// Normalizes a live chat message for display and caching.
const normalizeLiveChatMessage = (message) => ({
  ...message,
  senderRole: message?.senderRole || "user",
  senderName: message?.senderName || "User",
  message: message?.message || "",
});

// Normalizes a live chat thread response from the API.
const normalizeLiveChatThreadResponse = (thread) => ({
  ...normalizeLiveChatThread(thread),
  messages: Array.isArray(thread?.messages) ? thread.messages.map(normalizeLiveChatMessage) : [],
});

// Replaces the in-memory live chat cache with normalized threads.
const syncLiveChatCache = (threads) => {
  liveChatCache = Array.isArray(threads) ? threads.map(normalizeLiveChatThreadResponse) : [];
  return liveChatCache;
};

// Loads live chat threads from the backend.
export const loadLiveChatThreads = async (userId = null) => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const data = await handleApi(`/api/support/live-chat/threads${query}`);
  return syncLiveChatCache(data.threads || []);
};

// Loads live chat threads and returns summary counts.
export const fetchLiveChatThreadsSummary = async (userId = null) => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const data = await handleApi(`/api/support/live-chat/threads${query}`);
  const threads = syncLiveChatCache(data.threads || []);

  return {
    threads,
    totalCount: Number(data.totalCount ?? threads.length) || 0,
    unreadCount: Number(data.unreadCount) || 0,
  };
};

// Returns the current in-memory live chat cache.
export const getLiveChatThreads = () => liveChatCache;

// Finds a live chat thread for the given order and user.
export const getLiveChatThread = (orderId, userId) =>
  getLiveChatThreads().find(
    (thread) => String(thread.orderId) === String(orderId) && String(thread.userId) === String(userId),
  ) || null;

// Returns all live chat threads for a user, newest first.
export const getLiveChatThreadsForUser = (userId) =>
  getLiveChatThreads()
    .filter((thread) => String(thread.userId) === String(userId))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

// Counts threads whose latest message is still from the user.
export const getUnreadLiveChatThreadCount = () =>
  getLiveChatThreads().filter((thread) => thread.messages[thread.messages.length - 1]?.senderRole === "user").length;

// Resolves or creates a live chat thread for the order.
export const ensureLiveChatThread = async ({ order, user }) => {
  if (!order || !user) return null;

  const data = await handleApi("/api/support/live-chat/threads/resolve", {
    method: "POST",
    body: JSON.stringify({
      order,
      user,
    }),
  });

  const thread = normalizeLiveChatThreadResponse(data.thread);
  liveChatCache = [thread, ...liveChatCache.filter((item) => String(item.id) !== String(thread.id))];
  emitLiveChatUpdated();
  return thread;
};

// Sends a new live chat message and refreshes the cache.
export const sendLiveChatMessage = async ({ order, user, senderRole, senderName, message }) => {
  if (!order || !user || !message?.trim()) return null;

  const data = await handleApi("/api/support/live-chat/messages", {
    method: "POST",
    body: JSON.stringify({
      order,
      user,
      senderRole,
      senderName,
      message: message.trim(),
    }),
  });

  const thread = normalizeLiveChatThreadResponse(data.thread);
  liveChatCache = [thread, ...liveChatCache.filter((item) => String(item.id) !== String(thread.id))];
  emitLiveChatUpdated();
  return thread;
};

// Resolves an existing live chat thread for the order.
export const resolveLiveChatThread = async ({ order, user }) => {
  if (!order || !user) return null;
  return ensureLiveChatThread({ order, user });
};