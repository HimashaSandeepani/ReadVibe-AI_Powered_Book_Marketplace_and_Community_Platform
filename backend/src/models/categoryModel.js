// Category database access helpers and table initialization.
import { query } from '../config/database.js';

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      category_id BIGSERIAL PRIMARY KEY,
      category_name VARCHAR(100),
      status_id BIGINT REFERENCES status(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

ensureTable().catch((err) => console.error('Failed to ensure categories table', err));

const mapRow = (row) => ({
  id: row.category_id,
  name: row.category_name,
  statusId: row.status_id,
  createdAt: row.created_at,
});

export const listCategories = async () => {
  const { rows } = await query(
    'SELECT category_id, category_name, status_id, created_at FROM categories ORDER BY category_name ASC'
  );
  return rows.map(mapRow);
};

export const getCategoryById = async (id) => {
  const { rows } = await query(
    'SELECT category_id, category_name, status_id, created_at FROM categories WHERE category_id = $1 LIMIT 1',
    [id]
  );
  if (!rows[0]) return null;
  return mapRow(rows[0]);
};

export const createCategory = async ({ name }) => {
  const { rows } = await query(
    `INSERT INTO categories (category_name)
     VALUES ($1)
     RETURNING category_id`,
    [name]
  );
  return getCategoryById(rows[0].category_id);
};

export const updateCategory = async (id, updates = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`category_name = $${idx++}`);
    values.push(updates.name);
  }

  if (!fields.length) {
    return getCategoryById(id);
  }

  values.push(id);

  await query(
    `UPDATE categories SET ${fields.join(', ')} WHERE category_id = $${idx}`,
    values
  );

  return getCategoryById(id);
};

export const deleteCategory = async (id) => {
  await query('DELETE FROM categories WHERE category_id = $1', [id]);
};
