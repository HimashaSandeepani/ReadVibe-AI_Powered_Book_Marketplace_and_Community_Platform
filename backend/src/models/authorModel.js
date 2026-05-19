// Author database access helpers and table initialization.
import { query } from '../config/database.js';

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS authors (
      author_id BIGSERIAL PRIMARY KEY,
      author_name VARCHAR(200),
      status_id BIGINT REFERENCES status(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

ensureTable().catch((err) => console.error('Failed to ensure authors table', err));

const mapRow = (row) => ({
  id: row.author_id,
  name: row.author_name,
  statusId: row.status_id,
  createdAt: row.created_at,
});

export const listAuthors = async () => {
  const { rows } = await query(
    'SELECT author_id, author_name, status_id, created_at FROM authors ORDER BY author_name ASC'
  );
  return rows.map(mapRow);
};

export const getAuthorById = async (id) => {
  const { rows } = await query(
    'SELECT author_id, author_name, status_id, created_at FROM authors WHERE author_id = $1 LIMIT 1',
    [id]
  );
  if (!rows[0]) return null;
  return mapRow(rows[0]);
};

export const createAuthor = async ({ name }) => {
  const { rows } = await query(
    `INSERT INTO authors (author_name)
     VALUES ($1)
     RETURNING author_id`,
    [name]
  );
  return getAuthorById(rows[0].author_id);
};

export const updateAuthor = async (id, updates = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`author_name = $${idx++}`);
    values.push(updates.name);
  }

  if (!fields.length) {
    return getAuthorById(id);
  }

  values.push(id);

  await query(
    `UPDATE authors SET ${fields.join(', ')} WHERE author_id = $${idx}`,
    values
  );

  return getAuthorById(id);
};

export const deleteAuthor = async (id) => {
  await query('DELETE FROM authors WHERE author_id = $1', [id]);
};
