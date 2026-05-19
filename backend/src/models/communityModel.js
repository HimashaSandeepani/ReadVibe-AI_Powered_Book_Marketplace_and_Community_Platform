// Community post database access helpers.
import { query } from '../config/database.js';

const postBaseSelect = `
  SELECT
    p.id,
    p.user_id,
    u.username,
    u.full_name,
    p.title,
    p.category,
    p.content,
    p.book_id,
    p.book_title AS post_book_title,
    b.title AS linked_book_title,
    p.status,
    p.created_at,
    p.updated_at,
    COALESCE(
      ARRAY_AGG(DISTINCT l.user_id) FILTER (WHERE l.user_id IS NOT NULL),
      '{}'
    ) AS liked_by_user_ids,
    COALESCE(COUNT(DISTINCT l.user_id), 0) AS likes_count,
    COALESCE(COUNT(DISTINCT c.id), 0) AS comments_count
  FROM community_posts p
  LEFT JOIN users u ON u.user_id = p.user_id
  LEFT JOIN books b ON b.id = p.book_id
  LEFT JOIN community_likes l ON l.post_id = p.id
  LEFT JOIN community_comments c ON c.post_id = p.id
`;

const mapPostRow = (row) => ({
  id: row.id,
  userId: row.user_id,
  username: row.username,
  userFullName: row.full_name,
  title: row.title,
  category: row.category,
  content: row.content,
  bookId: row.book_id,
  bookTitle: row.post_book_title || row.linked_book_title,
  status: row.status,
  likedByUserIds: Array.isArray(row.liked_by_user_ids)
    ? row.liked_by_user_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id))
    : [],
  likesCount: Number(row.likes_count) || 0,
  commentsCount: Number(row.comments_count) || 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
      title TEXT,
      category TEXT,
      content TEXT NOT NULL,
      book_id BIGINT REFERENCES books(id) ON DELETE SET NULL,
      book_title TEXT,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS title TEXT;`);
  await query(`ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS book_title TEXT;`);

  await query(`
    CREATE TABLE IF NOT EXISTS community_comments (
      id BIGSERIAL PRIMARY KEY,
      post_id BIGINT REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS community_likes (
      post_id BIGINT REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (post_id, user_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS book_requests (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
      book_title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT,
      category TEXT,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
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
    console.error('Failed to ensure community tables', err);
  }
};

void ensureTablesWithRetry();

export const listPosts = async () => {
  const { rows } = await query(`${postBaseSelect} GROUP BY p.id, u.username, u.full_name, p.book_title, b.title ORDER BY p.created_at DESC`);
  return rows.map(mapPostRow);
};

export const getPostById = async (id) => {
  const { rows } = await query(
    `${postBaseSelect} WHERE p.id = $1 GROUP BY p.id, u.username, u.full_name, p.book_title, b.title`,
    [id]
  );
  if (!rows[0]) return null;
  return mapPostRow(rows[0]);
};

export const createPost = async ({ userId, title, category, content, bookId, bookTitle }) => {
  const { rows } = await query(
    `INSERT INTO community_posts (user_id, title, category, content, book_id, book_title)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [userId, title || null, category || null, content, bookId || null, bookTitle || null]
  );
  return getPostById(rows[0].id);
};

export const deletePost = async (id) => {
  await query('DELETE FROM community_posts WHERE id = $1', [id]);
};

export const listCommentsForPost = async (postId) => {
  const { rows } = await query(
    `SELECT c.id, c.post_id, c.user_id, u.username, u.full_name, c.content, c.created_at
     FROM community_comments c
     LEFT JOIN users u ON u.user_id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at DESC`,
    [postId]
  );

  return rows.map((row) => ({
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    username: row.username,
    userFullName: row.full_name,
    content: row.content,
    createdAt: row.created_at,
  }));
};

export const createComment = async ({ postId, userId, content }) => {
  await query(
    `INSERT INTO community_comments (post_id, user_id, content)
     VALUES ($1, $2, $3)`,
    [postId, userId, content]
  );
  return listCommentsForPost(postId);
};

export const toggleLike = async ({ postId, userId }) => {
  const inserted = await query(
    `INSERT INTO community_likes (post_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [postId, userId]
  );

  let liked;
  if (inserted.rowCount === 0) {
    await query('DELETE FROM community_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    liked = false;
  } else {
    liked = true;
  }

  const { rows } = await query(
    'SELECT COUNT(*) AS count FROM community_likes WHERE post_id = $1',
    [postId]
  );

  const likesCount = Number(rows[0]?.count || 0);
  return { liked, likesCount };
};

export const listBookRequests = async () => {
  const { rows } = await query(
    `SELECT r.id, r.user_id, u.username, u.full_name, u.email,
            r.book_title, r.author, r.isbn, r.category, r.reason,
            r.status, r.created_at, r.updated_at
     FROM book_requests r
     LEFT JOIN users u ON u.user_id = r.user_id
     ORDER BY r.created_at DESC`
  );

  return rows.map((row) => ({
    id: Number(row.id),
    userId: row.user_id !== null && row.user_id !== undefined ? Number(row.user_id) : null,
    username: row.username,
    userFullName: row.full_name,
    userEmail: row.email,
    bookTitle: row.book_title,
    author: row.author,
    isbn: row.isbn,
    category: row.category,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const createBookRequest = async ({
  userId,
  bookTitle,
  author,
  isbn,
  category,
  reason,
}) => {
  const { rows } = await query(
    `INSERT INTO book_requests (
       user_id,
       book_title,
       author,
       isbn,
       category,
       reason
     ) VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [userId, bookTitle, author, isbn || null, category || null, reason]
  );

  const { rows: result } = await query(
    `SELECT r.id, r.user_id, u.username, u.full_name, u.email,
            r.book_title, r.author, r.isbn, r.category, r.reason,
            r.status, r.created_at, r.updated_at
     FROM book_requests r
     LEFT JOIN users u ON u.user_id = r.user_id
     WHERE r.id = $1`,
    [rows[0].id]
  );

  const row = result[0];
  return {
    id: Number(row.id),
    userId: row.user_id !== null && row.user_id !== undefined ? Number(row.user_id) : null,
    username: row.username,
    userFullName: row.full_name,
    userEmail: row.email,
    bookTitle: row.book_title,
    author: row.author,
    isbn: row.isbn,
    category: row.category,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const updateBookRequestStatus = async (id, status) => {
  await query(
    `UPDATE book_requests
     SET status = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [status, id]
  );

  const { rows } = await query(
    `SELECT r.id, r.user_id, u.username, u.full_name, u.email,
            r.book_title, r.author, r.isbn, r.category, r.reason,
            r.status, r.created_at, r.updated_at
     FROM book_requests r
     LEFT JOIN users u ON u.user_id = r.user_id
     WHERE r.id = $1`,
    [id]
  );

  if (!rows[0]) return null;

  const row = rows[0];
  return {
    id: Number(row.id),
    userId: row.user_id !== null && row.user_id !== undefined ? Number(row.user_id) : null,
    username: row.username,
    userFullName: row.full_name,
    userEmail: row.email,
    bookTitle: row.book_title,
    author: row.author,
    isbn: row.isbn,
    category: row.category,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
