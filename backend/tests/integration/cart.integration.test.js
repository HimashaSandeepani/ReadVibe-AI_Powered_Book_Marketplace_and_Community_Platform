import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../../src/app.js';
import { createCartRouter } from '../../src/routes/cart.js';
import { jsonRequest, withServer } from './testUtils.js';

const controller = {
  getCart: async (req, res) => res.json({ items: [{ bookId: 7, quantity: 2 }] }),
  addCartItem: async (req, res) => res.status(201).json({ items: [{ bookId: 7, quantity: Number(req.body.quantity) }] }),
  updateCartItemHandler: async (req, res) => res.json({ items: [{ bookId: Number(req.params.bookId), quantity: Number(req.body.quantity) }] }),
  deleteCartItemHandler: async (req, res) => res.json({ items: [] }),
  clearCartHandler: async (req, res) => res.json({ items: [] }),
};

test('cart routes enforce user identity and forward valid operations', async () => {
  const app = createApp({ cartRouter: createCartRouter(controller) });

  await withServer(app, async (baseUrl) => {
    const blocked = await jsonRequest(baseUrl, '/api/cart');
    assert.equal(blocked.response.status, 400);
    assert.equal(blocked.data.error, 'userId is required');

    const fetched = await jsonRequest(baseUrl, '/api/cart?userId=5', {
      headers: { 'x-user-id': '5' },
    });
    assert.equal(fetched.response.status, 200);
    assert.deepEqual(fetched.data.items, [{ bookId: 7, quantity: 2 }]);

    const created = await jsonRequest(baseUrl, '/api/cart', {
      method: 'POST',
      headers: { 'x-user-id': '5' },
      body: JSON.stringify({ bookId: 7, quantity: 3 }),
    });
    assert.equal(created.response.status, 201);
    assert.equal(created.data.items[0].quantity, 3);

    const updated = await jsonRequest(baseUrl, '/api/cart/7', {
      method: 'PUT',
      headers: { 'x-user-id': '5' },
      body: JSON.stringify({ quantity: 4 }),
    });
    assert.equal(updated.response.status, 200);
    assert.equal(updated.data.items[0].quantity, 4);
  });
});