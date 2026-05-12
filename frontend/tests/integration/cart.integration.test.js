import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import {
  addCartItemApi,
  clearCartApi,
  deleteCartItemApi,
  fetchCartApi,
  updateCartItemApi,
} from "../../src/utils/cartApi.js";

import { installBrowserStubs } from "../testHelpers.js";

const calls = [];

beforeEach(() => {
  installBrowserStubs();
  calls.length = 0;

  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    return {
      ok: true,
      json: async () => ({
        items: [{ id: 1, bookId: 10, quantity: 2 }],
      }),
    };
  };
});

test("fetchCartApi reads cart items for the requested user", async () => {
  const items = await fetchCartApi(17);

  assert.deepEqual(items, [{ id: 1, bookId: 10, quantity: 2 }]);
  assert.equal(calls[0].url, "http://localhost:5000/api/cart?userId=17");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
});

test("addCartItemApi posts the cart payload and returns updated items", async () => {
  const items = await addCartItemApi(17, 10, 2);

  assert.deepEqual(items, [{ id: 1, bookId: 10, quantity: 2 }]);
  assert.equal(calls[0].options.method, "POST");
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    userId: 17,
    bookId: 10,
    quantity: 2,
  });
});

test("updateCartItemApi, deleteCartItemApi, and clearCartApi use the correct endpoints", async () => {
  await updateCartItemApi(17, 10, 3);
  await deleteCartItemApi(17, 10);
  await clearCartApi(17);

  assert.equal(calls[0].url, "http://localhost:5000/api/cart/10");
  assert.equal(calls[0].options.method, "PUT");
  assert.equal(calls[1].url, "http://localhost:5000/api/cart/10?userId=17");
  assert.equal(calls[1].options.method, "DELETE");
  assert.equal(calls[2].url, "http://localhost:5000/api/cart?userId=17");
  assert.equal(calls[2].options.method, "DELETE");
});