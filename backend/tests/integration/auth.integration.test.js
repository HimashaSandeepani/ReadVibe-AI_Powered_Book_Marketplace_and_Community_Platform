import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../../src/app.js';
import { createAuthRouter } from '../../src/routes/auth.js';
import { jsonRequest, withServer } from './testUtils.js';

const createUserModel = () => ({
  userExists: async () => false,
  createUser: async (payload) => ({ id: 10, ...payload }),
  verifyUser: async (identifier) => ({ id: 10, identifier, role: 'user' }),
});

test('POST /api/auth/register validates input and creates a user', async () => {
  const model = createUserModel();
  const app = createApp({ authRouter: createAuthRouter(model) });

  await withServer(app, async (baseUrl) => {
    const invalid = await jsonRequest(baseUrl, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    assert.equal(invalid.response.status, 400);

    const created = await jsonRequest(baseUrl, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
      }),
    });

    assert.equal(created.response.status, 201);
    assert.equal(created.data.user.id, 10);
    assert.equal(created.data.user.username, 'testuser');
  });
});

test('POST /api/auth/login rejects invalid credentials and returns a user on success', async () => {
  const model = {
    userExists: async () => false,
    createUser: async () => ({}),
    verifyUser: async (identifier, password) => (identifier === 'demo' && password === 'Secret123' ? { id: 11, role: 'user' } : null),
  };
  const app = createApp({ authRouter: createAuthRouter(model) });

  await withServer(app, async (baseUrl) => {
    const rejected = await jsonRequest(baseUrl, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'demo', password: 'wrong' }),
    });

    assert.equal(rejected.response.status, 401);

    const accepted = await jsonRequest(baseUrl, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'demo', password: 'Secret123' }),
    });

    assert.equal(accepted.response.status, 200);
    assert.equal(accepted.data.user.id, 11);
  });
});