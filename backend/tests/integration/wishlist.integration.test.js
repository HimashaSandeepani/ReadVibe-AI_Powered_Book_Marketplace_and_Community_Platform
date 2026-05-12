import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../../src/app.js';
import { createWishlistRouter } from '../../src/routes/wishlist.js';
import { jsonRequest, withServer } from './testUtils.js';

const controller = {
  getWishlist: async (req, res) => res.json({ items: [{ bookId: 9, priority: 3 }] }),
  addWishlist: async (req, res) => res.status(201).json({ items: [{ bookId: Number(req.body.bookId), priority: Number(req.body.priority) }] }),
  updateWishlist: async (req, res) => res.json({ items: [{ bookId: Number(req.params.bookId), priority: Number(req.body.priority) }] }),
  deleteWishlist: async (req, res) => res.json({ items: [] }),
  clearWishlistHandler: async (req, res) => res.json({ items: [] }),
};

test('wishlist routes enforce user identity and forward valid operations', async () => {
  const app = createApp({ wishlistRouter: createWishlistRouter(controller) });

  await withServer(app, async (baseUrl) => {
    const blocked = await jsonRequest(baseUrl, '/api/wishlist');
    assert.equal(blocked.response.status, 400);
    assert.equal(blocked.data.error, 'userId is required');

    const fetched = await jsonRequest(baseUrl, '/api/wishlist?userId=9', {
      headers: { 'x-user-id': '9' },
    });
    assert.equal(fetched.response.status, 200);
    assert.deepEqual(fetched.data.items, [{ bookId: 9, priority: 3 }]);

    const created = await jsonRequest(baseUrl, '/api/wishlist', {
      method: 'POST',
      headers: { 'x-user-id': '9' },
      body: JSON.stringify({ bookId: 11, priority: 4, notes: 'Read later' }),
    });
    assert.equal(created.response.status, 201);
    assert.equal(created.data.items[0].priority, 4);

    const updated = await jsonRequest(baseUrl, '/api/wishlist/11', {
      method: 'PUT',
      headers: { 'x-user-id': '9' },
      body: JSON.stringify({ priority: 5, notes: 'Priority read' }),
    });
    assert.equal(updated.response.status, 200);
    assert.equal(updated.data.items[0].priority, 5);
  });
});