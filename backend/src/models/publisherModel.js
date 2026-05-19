// Publisher database access helpers.
import { query } from '../config/database.js';

const baseSelect = `
  SELECT
    p.publisher_id,
    p.publisher_name,
    p.email,
    p.phone,
    p.address,
    p.status_id,
    p.created_at,
    COALESCE(book_stats.books_supplied, 0)::int AS books_supplied
  FROM publishers p
  LEFT JOIN (
    SELECT
      LOWER(TRIM(publisher)) AS normalized_publisher,
      COUNT(*)::int AS books_supplied
    FROM books
    WHERE publisher IS NOT NULL AND TRIM(publisher) <> ''
    GROUP BY LOWER(TRIM(publisher))
  ) book_stats
    ON book_stats.normalized_publisher = LOWER(TRIM(p.publisher_name))
`;

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS publishers (
      publisher_id BIGSERIAL PRIMARY KEY,
      publisher_name VARCHAR(200),
      email VARCHAR(255),
      phone VARCHAR(30),
      address TEXT,
      status_id BIGINT REFERENCES status(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

ensureTable().catch((err) => console.error('Failed to ensure publishers table', err));

const mapRow = (row) => ({
  id: row.publisher_id,
  name: row.publisher_name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  statusId: row.status_id,
  booksSupplied: Number(row.books_supplied) || 0,
  createdAt: row.created_at,
});

export const listPublishers = async () => {
  const { rows } = await query(`${baseSelect} ORDER BY p.publisher_name ASC`);
  return rows.map(mapRow);
};

export const getPublisherById = async (id) => {
  const { rows } = await query(`${baseSelect} WHERE p.publisher_id = $1 LIMIT 1`, [id]);
  if (!rows[0]) return null;
  return mapRow(rows[0]);
};

export const createPublisher = async ({ name, email, phone, address }) => {
  const { rows } = await query(
    `INSERT INTO publishers (publisher_name, email, phone, address)
     VALUES ($1, $2, $3, $4)
     RETURNING publisher_id`,
    [name, email || null, phone || null, address || null]
  );
  return getPublisherById(rows[0].publisher_id);
};

export const updatePublisher = async (id, updates = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`publisher_name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(updates.email);
  }
  if (updates.phone !== undefined) {
    fields.push(`phone = $${idx++}`);
    values.push(updates.phone);
  }
  if (updates.address !== undefined) {
    fields.push(`address = $${idx++}`);
    values.push(updates.address);
  }

  if (!fields.length) {
    return getPublisherById(id);
  }

  values.push(id);

  await query(
    `UPDATE publishers SET ${fields.join(', ')} WHERE publisher_id = $${idx}`,
    values
  );

  return getPublisherById(id);
};

export const deletePublisher = async (id) => {
  await query('DELETE FROM publishers WHERE publisher_id = $1', [id]);
};
