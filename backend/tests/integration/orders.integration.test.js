import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../../src/app.js';
import { createOrdersRouter } from '../../src/routes/orders.js';
import { jsonRequest, withServer } from './testUtils.js';

const controller = {
  getOrdersHandler: async (req, res) => res.json({ orders: [{ id: 1, userId: req.userId }] }),
  getAllOrdersHandler: async (req, res) => res.json({ orders: [{ id: 1 }] }),
  createOrderHandler: async (req, res) => res.status(201).json({ order: { id: 55, userId: req.userId, items: req.body.items } }),
  getOrderHandler: async (req, res) => res.json({ order: { id: Number(req.params.id), userId: req.userId } }),
  updateOrderStatusHandler: async (req, res) => res.json({ order: { id: Number(req.params.id), status: req.body.status } }),
  updateOrderTrackingHandler: async (req, res) => res.json({ order: { id: Number(req.params.id), trackingStatus: req.body.status } }),
};

test('order routes validate input and return expected payloads', async () => {
  const app = createApp({ ordersRouter: createOrdersRouter(controller) });

  await withServer(app, async (baseUrl) => {
    const blocked = await jsonRequest(baseUrl, '/api/orders');
    assert.equal(blocked.response.status, 400);

    const created = await jsonRequest(baseUrl, '/api/orders', {
      method: 'POST',
      headers: { 'x-user-id': '12' },
      body: JSON.stringify({ items: [{ bookId: 7, quantity: 2 }], shippingMethod: 'standard', shippingCost: 500 }),
    });
    assert.equal(created.response.status, 201);
    assert.equal(created.data.order.userId, 12);

    const fetched = await jsonRequest(baseUrl, '/api/orders/55?userId=12', {
      headers: { 'x-user-id': '12' },
    });
    assert.equal(fetched.response.status, 200);
    assert.equal(fetched.data.order.id, 55);

    const tracking = await jsonRequest(baseUrl, '/api/orders/55/tracking', {
      method: 'PUT',
      body: JSON.stringify({ status: 'shipped', note: 'Out for delivery' }),
    });
    assert.equal(tracking.response.status, 200);
    assert.equal(tracking.data.order.trackingStatus, 'shipped');
  });
});