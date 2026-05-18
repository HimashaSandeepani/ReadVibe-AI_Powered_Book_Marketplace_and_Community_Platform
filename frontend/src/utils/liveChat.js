const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const LIVE_CHAT_UPDATED_EVENT = "live-chat-updated";
let liveChatCache = [];

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const emitLiveChatUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LIVE_CHAT_UPDATED_EVENT));
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

export const getLiveChatUpdatedEventName = () => LIVE_CHAT_UPDATED_EVENT;

export const getLiveChatThreadKey = (orderId, userId) =>
  `CHAT-${orderId ?? "unknown"}-${userId ?? "unknown"}`;

export const normalizeLiveChatThread = (thread) => ({
  ...thread,
  messages: Array.isArray(thread?.messages) ? thread.messages : [],
});

const normalizeLiveChatMessage = (message) => ({
  ...message,
  senderRole: message?.senderRole || "user",
  senderName: message?.senderName || "User",
  message: message?.message || "",
});

const normalizeLiveChatThreadResponse = (thread) => ({
  ...normalizeLiveChatThread(thread),
  messages: Array.isArray(thread?.messages) ? thread.messages.map(normalizeLiveChatMessage) : [],
});

const syncLiveChatCache = (threads) => {
  liveChatCache = Array.isArray(threads) ? threads.map(normalizeLiveChatThreadResponse) : [];
  return liveChatCache;
};

export const loadLiveChatThreads = async (userId = null) => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const data = await handleApi(`/api/support/live-chat/threads${query}`);
  return syncLiveChatCache(data.threads || []);
};

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

export const getLiveChatThreads = () => liveChatCache;

export const getLiveChatThread = (orderId, userId) =>
  getLiveChatThreads().find(
    (thread) => String(thread.orderId) === String(orderId) && String(thread.userId) === String(userId),
  ) || null;

export const getLiveChatThreadsForUser = (userId) =>
  getLiveChatThreads()
    .filter((thread) => String(thread.userId) === String(userId))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

export const getUnreadLiveChatThreadCount = () =>
  getLiveChatThreads().filter((thread) => thread.messages[thread.messages.length - 1]?.senderRole === "user").length;

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

export const resolveLiveChatThread = async ({ order, user }) => {
  if (!order || !user) return null;
  return ensureLiveChatThread({ order, user });
};