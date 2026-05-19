// Support ticket and chat database access helpers.
import pool, { query } from '../config/database.js';

const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id BIGSERIAL PRIMARY KEY,
      order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
      order_number TEXT,
      user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
      user_name TEXT,
      user_email TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'support',
      source TEXT NOT NULL DEFAULT 'order-confirmation',
      status TEXT NOT NULL DEFAULT 'Open',
      replies JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    ALTER TABLE support_messages
    ADD COLUMN IF NOT EXISTS replies JSONB NOT NULL DEFAULT '[]'::jsonb;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS live_chat_threads (
      id TEXT PRIMARY KEY,
      order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
      order_number TEXT,
      user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
      user_name TEXT,
      user_email TEXT,
      status TEXT NOT NULL DEFAULT 'Open',
      messages JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    ALTER TABLE live_chat_threads
    ADD COLUMN IF NOT EXISTS messages JSONB NOT NULL DEFAULT '[]'::jsonb;
  `);
};

const ensureTablesWithRetry = async (attempt = 1) => {
  try {
    await ensureTables();
  } catch (err) {
    if (err?.code === '42P01' && attempt < 6) {
      setTimeout(() => {
        void ensureTablesWithRetry(attempt + 1);
      }, attempt * 1000);
      return;
    }
    console.error('Failed to ensure support tables', err);
  }
};

void ensureTablesWithRetry();

const mapReply = (reply) => ({
  id: reply.id,
  senderRole: reply.senderRole || 'stock',
  senderName: reply.senderName || 'Stock Manager',
  message: reply.message || '',
  createdAt: reply.createdAt,
});

const mapSupportMessage = (row) => ({
  id: row.id,
  orderId: row.order_id,
  orderNumber: row.order_number || row.order_id,
  userId: row.user_id,
  userName: row.user_name || 'User',
  userEmail: row.user_email || '',
  subject: row.subject,
  message: row.message,
  type: row.type || 'support',
  source: row.source || 'order-confirmation',
  status: row.status || 'Open',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  replies: Array.isArray(row.replies) ? row.replies.map(mapReply) : [],
});

const mapLiveChatMessage = (message) => ({
  id: message.id,
  senderRole: message.senderRole || 'user',
  senderName: message.senderName || 'User',
  message: message.message || '',
  createdAt: message.createdAt,
});

const mapLiveChatThread = (row) => ({
  id: row.id,
  orderId: row.order_id,
  orderNumber: row.order_number || row.order_id,
  userId: row.user_id,
  userName: row.user_name || 'User',
  userEmail: row.user_email || '',
  status: row.status || 'Open',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  messages: Array.isArray(row.messages) ? row.messages.map(mapLiveChatMessage) : [],
});

const buildSupportWhere = (userId) => {
  if (userId === null || userId === undefined || userId === '') {
    return { clause: '', params: [] };
  }

  if (!Number.isInteger(Number(userId))) {
    return { clause: '', params: [] };
  }

  return {
    clause: ' WHERE user_id = $1',
    params: [Number(userId)],
  };
};

export const getSupportMessages = async (userId = null) => {
  const { clause, params } = buildSupportWhere(userId);
  const { rows } = await query(
    `SELECT * FROM support_messages${clause} ORDER BY created_at DESC`,
    params
  );
  return rows.map(mapSupportMessage);
};

export const createSupportMessage = async ({
  orderId,
  orderNumber,
  userId,
  userName,
  userEmail,
  subject,
  message,
  type = 'support',
  source = 'order-confirmation',
}) => {
  if (!userId) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }

  if (!message?.trim()) {
    const err = new Error('message is required');
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();
  const resolvedSubject = subject || `Order ${orderNumber || orderId || 'support'} support request`;

  const { rows } = await query(
    `INSERT INTO support_messages (
       order_id, order_number, user_id, user_name, user_email, subject, message, type, source, status, replies, created_at, updated_at
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Open', '[]'::jsonb, $10, $10)
     RETURNING *`,
    [
      orderId || null,
      orderNumber || orderId || null,
      userId,
      userName || 'User',
      userEmail || '',
      resolvedSubject,
      message.trim(),
      type,
      source,
      now,
    ]
  );

  return mapSupportMessage(rows[0]);
};

export const addSupportReply = async (messageId, replyText, repliedBy = {}) => {
  if (!messageId || !replyText?.trim()) {
    const err = new Error('messageId and replyText are required');
    err.status = 400;
    throw err;
  }

  const { rows } = await query('SELECT * FROM support_messages WHERE id = $1 LIMIT 1', [messageId]);
  if (!rows[0]) return null;

  const message = rows[0];
  const now = new Date().toISOString();
  const reply = {
    id: `REP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderRole: repliedBy.role || 'stock',
    senderName: repliedBy.name || 'Stock Manager',
    message: replyText.trim(),
    createdAt: now,
  };

  const nextReplies = [...(Array.isArray(message.replies) ? message.replies : []), reply];
  const { rows: updatedRows } = await query(
    `UPDATE support_messages
     SET status = 'Replied', replies = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [JSON.stringify(nextReplies), messageId]
  );

  return mapSupportMessage(updatedRows[0]);
};

export const getUnreadSupportMessageCount = async () => {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS count FROM support_messages WHERE status = 'Open'`
  );
  return rows[0]?.count || 0;
};

const buildThreadWhere = (userId) => {
  if (userId === null || userId === undefined || userId === '') {
    return { clause: '', params: [] };
  }

  if (!Number.isInteger(Number(userId))) {
    return { clause: '', params: [] };
  }

  return {
    clause: ' WHERE user_id = $1',
    params: [Number(userId)],
  };
};

export const getLiveChatThreads = async (userId = null) => {
  const { clause, params } = buildThreadWhere(userId);
  const { rows } = await query(
    `SELECT * FROM live_chat_threads${clause} ORDER BY updated_at DESC`,
    params
  );
  return rows.map(mapLiveChatThread);
};

export const getLiveChatThread = async (orderId, userId) => {
  if (!orderId || !userId) return null;

  const { rows } = await query(
    `SELECT * FROM live_chat_threads WHERE order_id = $1 AND user_id = $2 LIMIT 1`,
    [orderId, userId]
  );
  return rows[0] ? mapLiveChatThread(rows[0]) : null;
};

export const ensureLiveChatThread = async ({ order, user }) => {
  if (!order || !user) return null;

  const orderId = order.id;
  const userId = user.id;
  const existing = await getLiveChatThread(orderId, userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const threadId = `CHAT-${orderId ?? 'unknown'}-${userId ?? 'unknown'}`;
  const thread = {
    id: threadId,
    orderId,
    orderNumber: order.orderNumber || order.id,
    userId,
    userName: user.name || user.fullName || user.username || 'User',
    userEmail: user.email || '',
    status: 'Open',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        senderRole: 'system',
        senderName: 'Support Team',
        message: 'Live chat is now open. A support agent will reply shortly.',
        createdAt: now,
      },
    ],
  };

  const { rows } = await query(
    `INSERT INTO live_chat_threads (
       id, order_id, order_number, user_id, user_name, user_email, status, messages, created_at, updated_at
     ) VALUES ($1, $2, $3, $4, $5, $6, 'Open', $7, $8, $8)
     RETURNING *`,
    [
      thread.id,
      thread.orderId || null,
      thread.orderNumber || null,
      thread.userId,
      thread.userName,
      thread.userEmail,
      JSON.stringify(thread.messages),
      now,
    ]
  );

  return mapLiveChatThread(rows[0]);
};

export const sendLiveChatMessage = async ({ order, user, senderRole, senderName, message }) => {
  if (!order || !user || !message?.trim()) return null;

  const orderId = order.id;
  const userId = user.id;
  const now = new Date().toISOString();
  const nextMessage = {
    id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderRole,
    senderName,
    message: message.trim(),
    createdAt: now,
  };

  const existing = await getLiveChatThread(orderId, userId);
  if (!existing) {
    const thread = await ensureLiveChatThread({ order, user });
    const messages = [...(thread?.messages || []), nextMessage];
    const { rows } = await query(
      `UPDATE live_chat_threads
       SET status = 'Open', messages = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(messages), thread.id]
    );
    return mapLiveChatThread(rows[0]);
  }

  const nextMessages = [...(existing.messages || []), nextMessage];
  const { rows } = await query(
    `UPDATE live_chat_threads
     SET status = 'Open', messages = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [JSON.stringify(nextMessages), existing.id]
  );

  return mapLiveChatThread(rows[0]);
};

export const resolveLiveChatThread = async ({ order, user }) => {
  if (!order || !user) return null;
  return ensureLiveChatThread({ order, user });
};

export const getUnreadLiveChatThreadCount = async () => {
  const { rows } = await query(`
    SELECT COUNT(*)::int AS count
    FROM live_chat_threads
    WHERE jsonb_array_length(messages) > 0
      AND (messages -> (jsonb_array_length(messages) - 1) ->> 'senderRole') = 'user'
  `);
  return rows[0]?.count || 0;
};

export const getLiveChatThreadCount = async () => {
  const { rows } = await query(`
    SELECT COUNT(*)::int AS count
    FROM live_chat_threads
  `);
  return rows[0]?.count || 0;
};
