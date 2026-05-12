import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import {
  getOrderedDatasetBookIds,
  getRecommendedBookIds,
  getRecommendedBooksByIds,
} from "../../src/components/OrderConfirmation/utils.js";

import { installBrowserStubs } from "../testHelpers.js";

beforeEach(() => {
  installBrowserStubs();
  Math.random = () => 0;
});

test("order confirmation recommendation flow returns four books in fallback order", () => {
  const books = [
    { id: 1, datasetBookId: "bk-1", author: "Author A", category: "Sci-Fi" },
    { id: 2, datasetBookId: "bk-2", author: "Author A", category: "Mystery" },
    { id: 3, datasetBookId: "bk-3", author: "Author B", category: "Sci-Fi" },
    { id: 4, datasetBookId: "bk-4", author: "Author C", category: "Sci-Fi" },
    { id: 5, datasetBookId: "bk-5", author: "Author D", category: "History" },
  ];

  const order = {
    items: [
      { bookId: 1 },
      { dataset_book_id: "bk-2" },
      { id: 3 },
    ],
  };

  const orderedIds = getOrderedDatasetBookIds(order, books);
  const recommendedIds = getRecommendedBookIds(orderedIds, [], books, 4);
  const recommendedBooks = getRecommendedBooksByIds(recommendedIds, books);

  assert.deepEqual(orderedIds, ["bk-1", "bk-2", "bk-3"]);
  assert.deepEqual(recommendedIds, ["bk-4", "bk-5"]);
  assert.deepEqual(
    recommendedBooks.map((book) => book.datasetBookId),
    ["bk-4", "bk-5"],
  );
});