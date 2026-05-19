// Book review database access helpers and table initialization.
import { query } from '../config/database.js';

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS book_reviews (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
      book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL,
      title TEXT,
      review_text TEXT NOT NULL,
      is_recommended BOOLEAN,
      helpful_votes INTEGER DEFAULT 0,
      verified_purchase BOOLEAN DEFAULT FALSE,
      order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
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
    console.error('Failed to ensure book_reviews table', err);
  }
};

void ensureTableWithRetry();

const baseSelect = `
  SELECT
    r.id,
    r.user_id,
    r.book_id,
    r.rating,
    r.title,
    r.review_text,
    r.is_recommended,
    r.helpful_votes,
    r.verified_purchase,
    r.order_id,
    r.created_at,
    r.updated_at,
    b.title AS book_title,
    b.author AS book_author,
    b.image AS book_image,
    u.full_name AS user_name
  FROM book_reviews r
  LEFT JOIN books b ON r.book_id = b.id
  LEFT JOIN users u ON r.user_id = u.user_id
`;

const mapRow = (row) => ({
  id: row.id,
  bookId: row.book_id?.toString(),
  bookTitle: row.book_title,
  bookAuthor: row.book_author,
  bookImage: row.book_image,
  userId: row.user_id,
  userName: row.user_name,
  rating: row.rating,
  title: row.title || '',
  text: row.review_text,
  recommend: row.is_recommended,
  date: row.created_at,
  helpfulVotes: row.helpful_votes ?? 0,
  verifiedPurchase: row.verified_purchase ?? false,
  orderId: row.order_id,
});

export const listReviewsForUser = async (userId) => {
  const { rows } = await query(
    `${baseSelect} WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
    [userId]
  );
  return rows.map(mapRow);
};

export const listReviewsForBook = async (bookId) => {
  const { rows } = await query(
    `${baseSelect} WHERE r.book_id = $1 ORDER BY r.created_at DESC`,
    [bookId]
  );
  return rows.map(mapRow);
};

export const createReview = async ({
  userId,
  bookId,
  rating,
  title,
  text,
  recommend,
  orderId,
}) => {
  const { rows } = await query(
    `INSERT INTO book_reviews (
       user_id,
       book_id,
       rating,
       title,
       review_text,
       is_recommended,
       verified_purchase,
       order_id
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      userId,
      bookId,
      rating,
      title || null,
      text,
      recommend ?? null,
      Boolean(orderId),
      orderId || null,
    ]
  );

  const reviewId = rows[0].id;
  const { rows: result } = await query(
    `${baseSelect} WHERE r.id = $1 LIMIT 1`,
    [reviewId]
  );

  return mapRow(result[0]);
};

export const deleteReviewById = async (userId, reviewId) => {
  await query('DELETE FROM book_reviews WHERE id = $1 AND user_id = $2', [reviewId, userId]);
};
