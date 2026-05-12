import assert from 'node:assert/strict';
import test from 'node:test';

import app from '../../src/app.js';
import { jsonRequest, withServer } from './testUtils.js';

test('GET /api/health returns server status', async () => {
  await withServer(app, async (baseUrl) => {
    const { response, data } = await jsonRequest(baseUrl, '/api/health');

    assert.equal(response.status, 200);
    assert.equal(data.status, 'Server is running');
    assert.ok(data.timestamp);
  });
});

test('unknown routes return 404', async () => {
  await withServer(app, async (baseUrl) => {
    const { response, data } = await jsonRequest(baseUrl, '/api/unknown-route');

    assert.equal(response.status, 404);
    assert.equal(data.error, 'Route not found');
  });
});