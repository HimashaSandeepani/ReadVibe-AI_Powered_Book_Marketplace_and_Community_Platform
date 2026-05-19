// Controller layer for support ticket and chat requests.
import {
  addSupportReply,
  createSupportMessage,
  getLiveChatThreadCount,
  getLiveChatThread,
  getLiveChatThreads,
  getSupportMessages,
  getUnreadLiveChatThreadCount,
  getUnreadSupportMessageCount,
  resolveLiveChatThread,
  sendLiveChatMessage,
} from '../models/supportModel.js';

const getOptionalUserId = (req) => {
  const raw = req.headers['x-user-id'] || req.query.userId || req.body?.userId;
  if (raw === undefined || raw === null || raw === '') return null;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const err = new Error('userId must be a positive integer');
    err.status = 400;
    throw err;
  }
  return parsed;
};

const requireUserId = (req) => {
  const userId = getOptionalUserId(req);
  if (!userId) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }
  return userId;
};

export const listSupportMessagesHandler = async (req, res, next) => {
  try {
    const userId = getOptionalUserId(req);
    const messages = await getSupportMessages(userId);
    res.json({ messages, unreadCount: await getUnreadSupportMessageCount() });
  } catch (err) {
    next(err);
  }
};

export const createSupportMessageHandler = async (req, res, next) => {
  try {
    const userId = requireUserId(req);
    const { orderId, orderNumber, userName, userEmail, subject, message, type, source } = req.body || {};
    const nextMessage = await createSupportMessage({
      orderId,
      orderNumber,
      userId,
      userName,
      userEmail,
      subject,
      message,
      type,
      source,
    });

    res.status(201).json({ message: nextMessage });
  } catch (err) {
    next(err);
  }
};

export const addSupportReplyHandler = async (req, res, next) => {
  try {
    const messageId = Number(req.params.id);
    const { replyText, senderName, senderRole } = req.body || {};
    const updatedMessage = await addSupportReply(messageId, replyText, {
      name: senderName,
      role: senderRole,
    });

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Support message not found' });
    }

    res.json({ message: updatedMessage });
  } catch (err) {
    next(err);
  }
};

export const listLiveChatThreadsHandler = async (req, res, next) => {
  try {
    const userId = getOptionalUserId(req);
    const threads = await getLiveChatThreads(userId);
    res.json({
      threads,
      totalCount: await getLiveChatThreadCount(),
      unreadCount: await getUnreadLiveChatThreadCount(),
    });
  } catch (err) {
    next(err);
  }
};

export const resolveLiveChatThreadHandler = async (req, res, next) => {
  try {
    const { order, user } = req.body || {};
    const thread = await resolveLiveChatThread({ order, user });
    if (!thread) {
      return res.status(400).json({ error: 'order and user are required' });
    }

    res.json({ thread });
  } catch (err) {
    next(err);
  }
};

export const sendLiveChatMessageHandler = async (req, res, next) => {
  try {
    const { order, user, senderRole, senderName, message } = req.body || {};
    const thread = await sendLiveChatMessage({ order, user, senderRole, senderName, message });

    if (!thread) {
      return res.status(400).json({ error: 'order, user, and message are required' });
    }

    res.status(201).json({ thread });
  } catch (err) {
    next(err);
  }
};

export const getLiveChatThreadHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const userId = Number(req.params.userId);
    const thread = await getLiveChatThread(orderId, userId);

    if (!thread) {
      return res.status(404).json({ error: 'Live chat thread not found' });
    }

    res.json({ thread });
  } catch (err) {
    next(err);
  }
};
