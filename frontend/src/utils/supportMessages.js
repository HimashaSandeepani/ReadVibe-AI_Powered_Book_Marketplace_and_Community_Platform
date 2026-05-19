// Support message cache and API helpers.
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const SUPPORT_MESSAGES_UPDATED_EVENT = "support-messages-updated";
export const SUPPORT_MESSAGES_CACHE_KEY = "supportMessagesCache";
let supportMessagesCache = [];

// Safely parses JSON with a fallback value.
const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

// Emits an update event for support message consumers.
const emitSupportMessagesUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SUPPORT_MESSAGES_UPDATED_EVENT));
};

// Sends JSON requests to the support backend APIs.
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

// Maps support status values to display labels.
export const getSupportMessageStatusLabel = (status) => {
  const normalizedStatus = String(status || "").trim().toLowerCase();

  if (normalizedStatus === "open") return "Processing";
  if (normalizedStatus === "replied") return "Replied";
  return status || "Open";
};

// Maps support status values to badge variants.
export const getSupportMessageStatusVariant = (status) => {
  const normalizedStatus = String(status || "").trim().toLowerCase();

  if (normalizedStatus === "open") return "warning text-dark";
  if (normalizedStatus === "replied") return "success";
  return "secondary";
};

// Normalizes a support message for display and caching.
const normalizeSupportMessage = (message) => ({
  ...message,
  orderId: message?.orderId ?? message?.order_id ?? null,
  orderNumber: message?.orderNumber ?? message?.order_number ?? message?.orderId ?? message?.order_id ?? null,
  userId: message?.userId ?? message?.user_id ?? null,
  userName: message?.userName ?? message?.user_name ?? "User",
  userEmail: message?.userEmail ?? message?.user_email ?? "",
  subject: message?.subject || "Support request",
  status: message?.status || "Open",
  type: message?.type || "support",
  source: message?.source || "order-confirmation",
  replies: Array.isArray(message?.replies) ? message.replies : [],
});

// Replaces the in-memory support message cache.
const syncSupportMessagesCache = (messages) => {
  supportMessagesCache = Array.isArray(messages) ? messages.map(normalizeSupportMessage) : [];
  return supportMessagesCache;
};

// Returns the normalized support message cache.
export const getStoredSupportMessagesCache = () => (
  Array.isArray(supportMessagesCache)
    ? supportMessagesCache.map(normalizeSupportMessage)
    : []
);

// Loads support messages from the backend.
export const loadSupportMessages = async (userId = null) => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const data = await handleApi(`/api/support/messages${query}`);

  const messages = Array.isArray(data.messages) ? data.messages.map(normalizeSupportMessage) : [];

  if (userId === null || userId === undefined || userId === "") {
    return syncSupportMessagesCache(messages);
  }

  return messages;
};

// Returns the current in-memory support message cache.
export const getSupportMessages = () => supportMessagesCache;

// Persists support messages to the in-memory cache and emits updates.
export const saveSupportMessages = async (messages) => {
  syncSupportMessagesCache(messages);
  emitSupportMessagesUpdated();
  return supportMessagesCache;
};

// Creates a new support message via the backend API.
export const createSupportMessage = async ({ order, user, message, type = "support", source = "order-confirmation" }) => {
  if (!order || !user || !message?.trim()) return null;

  const payload = {
    orderId: order.id,
    orderNumber: order.orderNumber || order.id,
    userName: user.name || user.fullName || user.username || "User",
    userEmail: user.email || "",
    subject: `Order ${order.orderNumber || order.id} support request`,
    message: message.trim(),
    type,
    source,
  };

  const data = await handleApi("/api/support/messages", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "x-user-id": user.id,
    },
  });

  const nextMessage = normalizeSupportMessage(data.message);
  supportMessagesCache = [nextMessage, ...supportMessagesCache.filter((item) => String(item.id) !== String(nextMessage.id))];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SUPPORT_MESSAGES_CACHE_KEY, JSON.stringify(supportMessagesCache));
  }
  emitSupportMessagesUpdated();
  return nextMessage;
};

// Adds a reply to an existing support message.
export const addSupportReply = async (messageId, replyText, repliedBy = {}) => {
  if (!messageId || !replyText?.trim()) return null;

  const data = await handleApi(`/api/support/messages/${messageId}/replies`, {
    method: "POST",
    body: JSON.stringify({
      replyText: replyText.trim(),
      senderName: repliedBy.name || "Stock Manager",
      senderRole: repliedBy.role || "stock",
    }),
  });

  const nextMessage = normalizeSupportMessage(data.message);
  supportMessagesCache = supportMessagesCache.map((item) =>
    String(item.id) === String(nextMessage.id) ? nextMessage : item,
  );
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SUPPORT_MESSAGES_CACHE_KEY, JSON.stringify(supportMessagesCache));
  }
  emitSupportMessagesUpdated();
  return nextMessage;
};

// Filters support messages by user ID.
export const getSupportMessagesForUser = (userId) => {
  const normalizedUserId = String(userId ?? "");
  return getSupportMessages().filter((message) => String(message.userId) === normalizedUserId);
};

// Counts support messages that are still open.
export const getUnreadSupportMessageCount = () =>
  getSupportMessages().filter((message) => message.status === "Open").length;

// Returns the support messages update event name.
export const getSupportMessagesUpdatedEventName = () => SUPPORT_MESSAGES_UPDATED_EVENT;