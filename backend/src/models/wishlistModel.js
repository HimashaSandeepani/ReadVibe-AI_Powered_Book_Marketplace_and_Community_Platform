// Wishlist database access helpers and table initialization.
import { query } from '../config/database.js';

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
      book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
      priority INTEGER NOT NULL DEFAULT 3,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uq_wishlist_user_book UNIQUE (user_id, book_id)
    );
  `);
};

const ensureTableWithRetry = async (attempt = 1) => {
  try {
    await ensureTable();
  } catch (err) {
    if (err?.code === '42P01' && attempt < 6) {
      setTimeout(() => {
        void ensureTableWithRetry(attempt + 1);
      }, attempt * 1000);
      return;
    }
    console.error('Failed to ensure wishlist_items table', err);
  }
};

void ensureTableWithRetry();

const baseSelect = `
  SELECT
    w.user_id,
    w.book_id,
    w.priority,
    w.notes,
    w.created_at,
    w.updated_at,
    b.title,
    b.author,
    b.price,
    b.image,
    b.images,
    b.stock,
    b.status,
    b.category
  FROM wishlist_items w
  LEFT JOIN books b ON w.book_id = b.id
`;

const mapRow = (row) => ({
  userId: row.user_id,
  bookId: row.book_id,
  id: row.book_id,
  priority: row.priority,
  notes: row.notes,
  dateAdded: row.created_at,
  title: row.title,
  author: row.author,
  price: row.price !== null ? Number(row.price) : 0,
  image: row.image || (Array.isArray(row.images) && row.images[0]) || null,
  stock: row.stock,
  status: row.status,
  category: row.category,
  inStock: row.stock === null ? true : row.stock > 0,
});

export const getWishlistForUser = async (userId) => {
  const { rows } = await query(`${baseSelect} WHERE w.user_id = $1 ORDER BY w.created_at DESC`, [userId]);
  return rows.map(mapRow);
};

export const addWishlistItem = async (userId, bookId, priority = 3, notes = null) => {
  await query(
    `INSERT INTO wishlist_items (user_id, book_id, priority, notes)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, book_id)
     DO UPDATE SET priority = EXCLUDED.priority, notes = EXCLUDED.notes, updated_at = NOW()` ,
    [userId, bookId, priority, notes]
  );
  return getWishlistForUser(userId);
};

export const updateWishlistItem = async (userId, bookId, updates = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.priority !== undefined) {
    fields.push(`priority = $${idx}`);
    values.push(updates.priority);
    idx += 1;
  }

  if (updates.notes !== undefined) {
    fields.push(`notes = $${idx}`);
    values.push(updates.notes);
    idx += 1;
  }

  if (fields.length === 0) {
    return getWishlistForUser(userId);
  }

  values.push(userId, bookId);

  await query(
    `UPDATE wishlist_items SET ${fields.join(', ')}, updated_at = NOW()
     WHERE user_id = $${idx} AND book_id = $${idx + 1}`,
    values
  );

  return getWishlistForUser(userId);
};

export const deleteWishlistItem = async (userId, bookId) => {
  await query('DELETE FROM wishlist_items WHERE user_id = $1 AND book_id = $2', [userId, bookId]);
  return getWishlistForUser(userId);
};

export const clearWishlist = async (userId) => {
  await query('DELETE FROM wishlist_items WHERE user_id = $1', [userId]);
  return [];
};
