// Book database access helpers and catalog queries.
import { query } from '../config/database.js';

const baseSelect = `
  SELECT
    id,
    dataset_book_id,
    isbn,
    title,
    author,
    category,
    price,
    cost_price,
    stock,
    min_stock,
    max_stock,
    status,
    description,
    publisher,
    publication_year,
    pages,
    language,
    weight,
    dimensions,
    image,
    images,
    featured,
    sales_this_month,
    total_sales,
    COALESCE(review_stats.review_count, 0) AS review_count,
    COALESCE(review_stats.average_rating, 0) AS average_rating,
    created_at,
    updated_at
  FROM books
  LEFT JOIN (
    SELECT
      book_id,
      COUNT(*)::int AS review_count,
      ROUND(AVG(rating)::numeric, 1) AS average_rating
    FROM book_reviews
    GROUP BY book_id
  ) review_stats ON review_stats.book_id = books.id
`;

const mapRow = (row) => ({
  id: row.id,
  datasetBookId: row.dataset_book_id,
  isbn: row.isbn,
  title: row.title,
  author: row.author,
  category: row.category,
  price: Number(row.price) || 0,
  costPrice: row.cost_price !== null ? Number(row.cost_price) : null,
  stock: row.stock,
  minStock: row.min_stock,
  maxStock: row.max_stock,
  status: row.status,
  description: row.description,
  publisher: row.publisher,
  publicationYear: row.publication_year,
  pages: row.pages,
  language: row.language,
  weight: row.weight,
  dimensions: row.dimensions,
  image: row.image,
  images: Array.isArray(row.images) ? row.images : row.images ? row.images : [],
  featured: row.featured,
  salesThisMonth: row.sales_this_month,
  totalSales: row.total_sales,
  reviews: Number(row.review_count) || 0,
  rating: row.average_rating !== null && row.average_rating !== undefined ? Number(row.average_rating) : null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS books (
      id BIGSERIAL PRIMARY KEY,
      dataset_book_id TEXT,
      isbn TEXT,
      title TEXT NOT NULL,
      author TEXT,
      category TEXT,
      price NUMERIC(12, 2) NOT NULL DEFAULT 0,
      cost_price NUMERIC(12, 2),
      stock INTEGER NOT NULL DEFAULT 0,
      min_stock INTEGER NOT NULL DEFAULT 0,
      max_stock INTEGER NOT NULL DEFAULT 0,
      status TEXT,
      description TEXT,
      publisher TEXT,
      publication_year INTEGER,
      pages INTEGER,
      language TEXT,
      weight TEXT,
      dimensions TEXT,
      image TEXT,
      images JSONB,
      featured BOOLEAN DEFAULT FALSE,
      sales_this_month INTEGER DEFAULT 0,
      total_sales INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

const ensureLegacyColumns = async () => {
  // Reconcile legacy schemas where books table exists with only partial columns.
  await query(`
    ALTER TABLE books
      ADD COLUMN IF NOT EXISTS id BIGSERIAL,
      ADD COLUMN IF NOT EXISTS dataset_book_id TEXT,
      ADD COLUMN IF NOT EXISTS isbn TEXT,
      ADD COLUMN IF NOT EXISTS title TEXT,
      ADD COLUMN IF NOT EXISTS author TEXT,
      ADD COLUMN IF NOT EXISTS category TEXT,
      ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS cost_price NUMERIC(12, 2),
      ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS min_stock INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS max_stock INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS status TEXT,
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS publisher TEXT,
      ADD COLUMN IF NOT EXISTS publication_year INTEGER,
      ADD COLUMN IF NOT EXISTS pages INTEGER,
      ADD COLUMN IF NOT EXISTS language TEXT,
      ADD COLUMN IF NOT EXISTS weight TEXT,
      ADD COLUMN IF NOT EXISTS dimensions TEXT,
      ADD COLUMN IF NOT EXISTS image TEXT,
      ADD COLUMN IF NOT EXISTS images JSONB,
      ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS sales_this_month INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  `);
};

const ensureBookSchema = async () => {
  await ensureTable();
  await ensureLegacyColumns();
};

ensureBookSchema().catch((err) => {
  console.error('Failed to ensure books table', err);
});

const computeStatus = (stock, minStock) => {
  if (!Number.isFinite(stock)) return 'Out of Stock';
  if (stock === 0) return 'Out of Stock';
  if (stock <= (Number.isFinite(minStock) ? minStock : 0)) return 'Low Stock';
  return 'In Stock';
};

const normalizeImages = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return [];

  if (Array.isArray(value)) {
    return value
      .map((img) => (typeof img === 'string' ? img.trim() : String(img || '').trim()))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((img) => (typeof img === 'string' ? img.trim() : String(img || '').trim()))
          .filter(Boolean);
      }
      if (typeof parsed === 'string') {
        const single = parsed.trim();
        return single ? [single] : [];
      }
    } catch {
      // Treat a plain URL/path string as a single image when it is not JSON.
    }

    return [trimmed];
  }

  if (typeof value === 'object') {
    if (typeof value.url === 'string' && value.url.trim()) {
      return [value.url.trim()];
    }
    return [];
  }

  return [];
};

export const listBooks = async () => {
  const { rows } = await query(`${baseSelect} ORDER BY created_at DESC`);
  return rows.map(mapRow);
};

export const getBookById = async (id) => {
  const { rows } = await query(`${baseSelect} WHERE id = $1 LIMIT 1`, [id]);
  if (!rows[0]) return null;
  return mapRow(rows[0]);
};

export const createBook = async (payload) => {
  const status = payload.status || computeStatus(payload.stock ?? 0, payload.minStock ?? 0);
  const normalizedImages = normalizeImages(payload.images) ?? [];
  const { rows } = await query(
    `INSERT INTO books (
      dataset_book_id,
      isbn,
      title,
      author,
      category,
      price,
      cost_price,
      stock,
      min_stock,
      max_stock,
      status,
      description,
      publisher,
      publication_year,
      pages,
      language,
      weight,
      dimensions,
      image,
      images,
      featured,
      sales_this_month,
      total_sales
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
    ) RETURNING id`,
    [
      payload.datasetBookId || null,
      payload.isbn || null,
      payload.title,
      payload.author || null,
      payload.category || null,
      payload.price ?? 0,
      payload.costPrice ?? null,
      payload.stock ?? 0,
      payload.minStock ?? 0,
      payload.maxStock ?? 0,
      status,
      payload.description || null,
      payload.publisher || null,
      payload.publicationYear || null,
      payload.pages || null,
      payload.language || null,
      payload.weight || null,
      payload.dimensions || null,
      payload.image || null,
      JSON.stringify(normalizedImages),
      payload.featured ?? false,
      payload.salesThisMonth ?? 0,
      payload.totalSales ?? 0,
    ]
  );

  return getBookById(rows[0].id);
};

export const updateBook = async (id, updates = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  const addField = (column, value) => {
    fields.push(`${column} = $${idx}`);
    values.push(value);
    idx += 1;
  };

  if (updates.isbn !== undefined) addField('isbn', updates.isbn);
  if (updates.datasetBookId !== undefined) addField('dataset_book_id', updates.datasetBookId);
  if (updates.title !== undefined) addField('title', updates.title);
  if (updates.author !== undefined) addField('author', updates.author);
  if (updates.category !== undefined) addField('category', updates.category);
  if (updates.price !== undefined) addField('price', updates.price);
  if (updates.costPrice !== undefined) addField('cost_price', updates.costPrice);
  if (updates.stock !== undefined) addField('stock', updates.stock);
  if (updates.minStock !== undefined) addField('min_stock', updates.minStock);
  if (updates.maxStock !== undefined) addField('max_stock', updates.maxStock);
  if (updates.description !== undefined) addField('description', updates.description);
  if (updates.publisher !== undefined) addField('publisher', updates.publisher);
  if (updates.publicationYear !== undefined) addField('publication_year', updates.publicationYear);
  if (updates.pages !== undefined) addField('pages', updates.pages);
  if (updates.language !== undefined) addField('language', updates.language);
  if (updates.weight !== undefined) addField('weight', updates.weight);
  if (updates.dimensions !== undefined) addField('dimensions', updates.dimensions);
  if (updates.image !== undefined) addField('image', updates.image);
  if (updates.images !== undefined) {
    const normalizedImages = normalizeImages(updates.images) ?? [];
    addField('images', JSON.stringify(normalizedImages));
  }
  if (updates.featured !== undefined) addField('featured', updates.featured);
  if (updates.salesThisMonth !== undefined) addField('sales_this_month', updates.salesThisMonth);
  if (updates.totalSales !== undefined) addField('total_sales', updates.totalSales);

  // Allow status override, otherwise recompute if stock/minStock provided
  if (updates.status !== undefined) {
    addField('status', updates.status);
  } else if (updates.stock !== undefined || updates.minStock !== undefined) {
    const existing = await getBookById(id);
    const nextStock = updates.stock !== undefined ? updates.stock : existing?.stock ?? 0;
    const nextMin = updates.minStock !== undefined ? updates.minStock : existing?.minStock ?? 0;
    addField('status', computeStatus(nextStock, nextMin));
  }

  if (fields.length === 0) {
    return getBookById(id);
  }

  addField('updated_at', new Date());
  values.push(id);

  await query(`UPDATE books SET ${fields.join(', ')} WHERE id = $${idx}`, values);
  return getBookById(id);
};

export const deleteBook = async (id) => {
  await query('DELETE FROM books WHERE id = $1', [id]);
};
