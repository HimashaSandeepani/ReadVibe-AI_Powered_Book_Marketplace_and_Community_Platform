// Shopping cart database access helpers.
import { query } from '../config/database.js';

const baseSelect = `
  SELECT
    c.user_id,
    c.book_id,
    c.quantity,
    b.title,
    b.price,
    b.image,
    b.images,
    b.stock,
    b.status,
    b.category
  FROM cart_items c
  LEFT JOIN books b ON c.book_id = b.id
`;

const mapRow = (row) => ({
  userId: row.user_id,
  bookId: row.book_id,
  quantity: row.quantity,
  title: row.title,
  price: row.price !== null ? Number(row.price) : null,
  image: row.image || (Array.isArray(row.images) && row.images[0]) || null,
  stock: row.stock,
  status: row.status,
  category: row.category,
});

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
      book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uq_cart_user_book UNIQUE (user_id, book_id)
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
    console.error('Failed to ensure cart_items table', err);
  }
};

void ensureTableWithRetry();

export const getCartForUser = async (userId) => {
  const { rows } = await query(`${baseSelect} WHERE c.user_id = $1 ORDER BY c.id DESC`, [userId]);
  return rows.map(mapRow);
};

const upsertCartRow = async (userId, bookId, quantity) => {
  const qty = Math.max(1, quantity || 1);
  await query(
    `INSERT INTO cart_items (user_id, book_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, book_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()`,
    [userId, bookId, qty]
  );
};

export const addToCart = async (userId, bookId, quantity = 1) => {
  await upsertCartRow(userId, bookId, quantity);
  return getCartForUser(userId);
};

export const updateCartItem = async (userId, bookId, quantity) => {
  if (quantity <= 0) {
    await deleteCartItem(userId, bookId);
    return getCartForUser(userId);
  }

  await query(
    'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE user_id = $2 AND book_id = $3',
    [quantity, userId, bookId]
  );
  return getCartForUser(userId);
};

export const deleteCartItem = async (userId, bookId) => {
  await query('DELETE FROM cart_items WHERE user_id = $1 AND book_id = $2', [userId, bookId]);
};

export const clearCart = async (userId) => {
  await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
};
