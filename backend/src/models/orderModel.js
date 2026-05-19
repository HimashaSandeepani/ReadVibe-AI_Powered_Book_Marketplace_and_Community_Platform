// Order database access helpers and table initialization.
import pool, { query } from '../config/database.js';

const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      shipping_method TEXT,
      shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
      tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
      subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
      total NUMERIC(12, 2) NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'LKR',
      shipping_address JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS tracking_updates JSONB NOT NULL DEFAULT '[]'::jsonb;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
      book_id BIGINT REFERENCES books(id) ON DELETE SET NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
      line_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
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
    console.error('Failed to ensure orders tables', err);
  }
};

void ensureTablesWithRetry();

const mapOrder = (row) => ({
  id: row.id,
  userId: Number(row.user_id) || row.user_id,
  customer: row.customer_name || null,
  customerEmail: row.customer_email || null,
  status: row.status,
  shippingMethod: row.shipping_method,
  shippingCost: Number(row.shipping_cost) || 0,
  tax: Number(row.tax) || 0,
  subtotal: Number(row.subtotal) || 0,
  total: Number(row.total) || 0,
  currency: row.currency,
  shippingAddress: row.shipping_address || {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  orderDate: row.created_at,
});

const mapOrderWithTracking = (row) => {
  const trackingUpdates = Array.isArray(row.tracking_updates)
    ? row.tracking_updates
    : [];
  const latestTrackingUpdate = trackingUpdates[trackingUpdates.length - 1] || null;

  return {
    ...mapOrder(row),
    trackingUpdates,
    trackingNumber: latestTrackingUpdate?.trackingNumber || null,
    courier: latestTrackingUpdate?.courier || null,
    trackingLocation: latestTrackingUpdate?.location || null,
    trackingNote: latestTrackingUpdate?.note || null,
    trackingStatus: latestTrackingUpdate?.status || null,
    trackingUpdatedAt: latestTrackingUpdate?.timestamp || null,
  };
};

const mapItem = (row) => ({
  id: row.id,
  orderId: row.order_id,
  bookId: row.book_id,
  quantity: row.quantity,
  unitPrice: Number(row.unit_price) || 0,
  lineTotal: Number(row.line_total) || 0,
  title: row.title,
  image: row.image,
});

const getOrderItems = async (orderId) => {
  const { rows } = await query(
    `SELECT oi.*, b.title, b.image
     FROM order_items oi
     LEFT JOIN books b ON oi.book_id = b.id
     WHERE oi.order_id = $1
     ORDER BY oi.id ASC`,
    [orderId]
  );
  return rows.map(mapItem);
};

export const getOrderById = async (orderId) => {
  const { rows } = await query(
    `SELECT o.*, u.full_name AS customer_name, u.email AS customer_email
     FROM orders o
     LEFT JOIN users u ON u.user_id = o.user_id
     WHERE o.id = $1
     LIMIT 1`,
    [orderId]
  );
  if (!rows[0]) return null;
  const order = mapOrderWithTracking(rows[0]);
  const items = await getOrderItems(orderId);
  return { ...order, items, itemCount: items.length };
};

export const getOrdersForUser = async (userId) => {
  const { rows } = await query(
    `SELECT o.*, u.full_name AS customer_name, u.email AS customer_email
     FROM orders o
     LEFT JOIN users u ON u.user_id = o.user_id
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  );
  const orders = [];
  for (const row of rows) {
    const order = mapOrderWithTracking(row);
    const items = await getOrderItems(row.id);
    orders.push({ ...order, items, itemCount: items.length });
  }
  return orders;
};

export const getAllOrders = async () => {
  const { rows } = await query(
    `SELECT o.*, u.full_name AS customer_name, u.email AS customer_email
     FROM orders o
     LEFT JOIN users u ON u.user_id = o.user_id
     ORDER BY o.created_at DESC`
  );
  const orders = [];
  for (const row of rows) {
    const order = mapOrderWithTracking(row);
    const items = await getOrderItems(row.id);
    orders.push({
      ...order,
      items,
      itemCount: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    });
  }
  return orders;
};

export const updateOrderStatus = async (orderId, status) => {
  const { rows } = await query(
    `UPDATE orders
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id`,
    [status, orderId]
  );

  if (!rows[0]) return null;
  return getOrderById(orderId);
};

export const updateOrderTracking = async (orderId, trackingUpdate) => {
  const order = await getOrderById(orderId);
  if (!order) return null;

  const nextUpdate = {
    status: trackingUpdate.status,
    note: trackingUpdate.note || "",
    location: trackingUpdate.location || "",
    courier: trackingUpdate.courier || "",
    trackingNumber: trackingUpdate.trackingNumber || "",
    timestamp: trackingUpdate.timestamp || new Date().toISOString(),
    updatedBy: trackingUpdate.updatedBy || null,
  };

  const nextTrackingUpdates = [...(order.trackingUpdates || []), nextUpdate];

  const { rows } = await query(
    `UPDATE orders
     SET status = $1,
         tracking_updates = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING id`,
    [nextUpdate.status, JSON.stringify(nextTrackingUpdates), orderId]
  );

  if (!rows[0]) return null;
  return getOrderById(orderId);
};

export const createOrder = async ({
  userId,
  items,
  shipping,
  shippingMethod,
  shippingCost = 0,
}) => {
  if (!userId) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('At least one item is required');
    err.status = 400;
    throw err;
  }

  const bookIds = items.map((i) => Number(i.bookId)).filter(Boolean);
  const { rows: bookRows } = await query(
    'SELECT id, price, cost_price, stock, title, image, sales_this_month, total_sales FROM books WHERE id = ANY($1)',
    [bookIds]
  );
  const booksById = new Map(bookRows.map((b) => [Number(b.id), b]));

  const missing = bookIds.filter((id) => !booksById.has(id));
  if (missing.length) {
    const err = new Error(`Books not found: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const computedItems = items.map((item) => {
    const book = booksById.get(Number(item.bookId));
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if ((Number(book.stock) || 0) < quantity) {
      const err = new Error(`Insufficient stock for "${book.title}"`);
      err.status = 400;
      throw err;
    }
    const unitPrice = Number(book.price) || 0;
    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    return {
      bookId: Number(item.bookId),
      quantity,
      unitPrice,
      lineTotal,
      title: book.title,
      image: book.image,
    };
  });

  const subtotal = computedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shippingCostValue = Number(shippingCost) || 0;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shippingCostValue + tax).toFixed(2));

  const address = shipping ? { ...shipping } : null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO orders (
         user_id, status, shipping_method, shipping_cost, tax, subtotal, total, currency, shipping_address
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [userId, 'Processing', shippingMethod || null, shippingCostValue, tax, subtotal, total, 'LKR', address]
    );

    const orderId = rows[0].id;

    for (const item of computedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, book_id, quantity, unit_price, line_total)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.bookId, item.quantity, item.unitPrice, item.lineTotal]
      );

      await client.query(
        `UPDATE books
         SET stock = stock - $1,
             sales_this_month = COALESCE(sales_this_month, 0) + $1,
             total_sales = COALESCE(total_sales, 0) + $1,
             status = CASE
               WHEN stock - $1 <= 0 THEN 'Out of Stock'
               WHEN stock - $1 <= COALESCE(min_stock, 0) THEN 'Low Stock'
               ELSE 'In Stock'
             END,
             updated_at = NOW()
         WHERE id = $2`,
        [item.quantity, item.bookId]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    await client.query('COMMIT');

    return getOrderById(orderId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
