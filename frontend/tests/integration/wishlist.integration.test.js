import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import {
  addToWishlist,
  getCurrentUser,
  setCurrentUser,
} from "../../src/utils/helpers.js";
import {
  addWishlistItemApi,
  clearWishlistApi,
  fetchWishlistApi,
  updateWishlistItemApi,
} from "../../src/utils/wishlistApi.js";

import { installBrowserStubs } from "../testHelpers.js";

const calls = [];
const events = [];

beforeEach(() => {
  installBrowserStubs();
  calls.length = 0;
  events.length = 0;

  window.dispatchEvent = (event) => {
    events.push(event.type);
  };

  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    return {
      ok: true,
      json: async () => ({
        items: [{ id: 77, bookId: 99, priority: 3 }],
      }),
    };
  };
});

test("setCurrentUser normalizes ids before wishlist actions run", () => {
  setCurrentUser({ userID: "22", role: "user" });

  assert.equal(getCurrentUser().id, 22);
});

test("addToWishlist sends normalized ids to the backend helper", async () => {
  const items = await addToWishlist(99, 22);

  assert.deepEqual(items, [{ id: 77, bookId: 99, priority: 3 }]);
  assert.equal(calls[0].url, "http://localhost:5000/api/wishlist");
  assert.equal(calls[0].options.method, "POST");
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    userId: "22",
    bookId: "99",
    priority: "3",
    notes: "",
  });
});

test("fetchWishlistApi and updateWishlistItemApi sync storage and emit update events", async () => {
  await fetchWishlistApi(22);
  await updateWishlistItemApi({ userId: 22, bookId: 99, priority: 4, notes: "Keep" });

  assert.equal(localStorage.getItem("wishlist_22") !== null, true);
  assert.deepEqual(events, ["wishlist-updated", "wishlist-updated"]);
  assert.equal(calls[0].url, "http://localhost:5000/api/wishlist?userId=22");
  assert.equal(calls[1].url, "http://localhost:5000/api/wishlist/99");
});

test("clearWishlistApi clears the backend state for the user", async () => {
  await clearWishlistApi(22);

  assert.equal(calls[0].url, "http://localhost:5000/api/wishlist?userId=22");
  assert.equal(calls[0].options.method, "DELETE");
});

test("addWishlistItemApi rejects missing ids", async () => {
  await assert.rejects(
    () => addWishlistItemApi({ userId: null, bookId: 99 }),
    /userId is required/,
  );
});