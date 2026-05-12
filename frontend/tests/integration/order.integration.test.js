import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import {
  createOrderApi,
  getOrderApi,
  getOrdersApi,
  updateOrderTrackingApi,
} from "../../src/utils/orderApi.js";

import { installBrowserStubs } from "../testHelpers.js";

const calls = [];

beforeEach(() => {
  installBrowserStubs();
  calls.length = 0;

  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    if (String(url).includes("/tracking")) {
      return {
        ok: true,
        json: async () => ({
          order: { id: 55, trackingStatus: "shipped" },
        }),
      };
    }

    if (String(url).includes("/api/orders/") && !String(url).includes("?")) {
      return {
        ok: true,
        json: async () => ({
          order: { id: 55, userId: 9, total: 1500 },
        }),
      };
    }

    if (String(url).includes("/api/orders?")) {
      return {
        ok: true,
        json: async () => ({
          orders: [{ id: 55, userId: 9, total: 1500 }],
        }),
      };
    }

    return {
      ok: true,
      json: async () => ({
        order: { id: 55, userId: 9, total: 1500 },
      }),
    };
  };
});

test("createOrderApi normalizes the user id and sends the order payload", async () => {
  const order = await createOrderApi({
    userId: "9",
    items: [{ id: 10, quantity: 2 }],
    shipping: { city: "Colombo" },
    shippingMethod: "standard",
    shippingCost: 500,
  });

  assert.deepEqual(order, { id: 55, userId: 9, total: 1500 });
  assert.equal(calls[0].url, "http://localhost:5000/api/orders");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers["x-user-id"], 9);
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    userId: 9,
    items: [{ id: 10, quantity: 2 }],
    shipping: { city: "Colombo" },
    shippingMethod: "standard",
    shippingCost: 500,
  });
});

test("getOrdersApi and getOrderApi target the correct endpoints", async () => {
  const orders = await getOrdersApi(9);
  const order = await getOrderApi(9, 55);

  assert.deepEqual(orders, [{ id: 55, userId: 9, total: 1500 }]);
  assert.deepEqual(order, { id: 55, userId: 9, total: 1500 });
  assert.equal(calls[0].url, "http://localhost:5000/api/orders?userId=9");
  assert.equal(calls[0].options.headers["x-user-id"], 9);
  assert.equal(calls[1].url, "http://localhost:5000/api/orders/55?userId=9");
  assert.equal(calls[1].options.headers["x-user-id"], 9);
});

test("updateOrderTrackingApi sends tracking updates to the order endpoint", async () => {
  const order = await updateOrderTrackingApi(55, { trackingStatus: "shipped" });

  assert.deepEqual(order, { id: 55, trackingStatus: "shipped" });
  assert.equal(calls[0].url, "http://localhost:5000/api/orders/55/tracking");
  assert.equal(calls[0].options.method, "PUT");
});