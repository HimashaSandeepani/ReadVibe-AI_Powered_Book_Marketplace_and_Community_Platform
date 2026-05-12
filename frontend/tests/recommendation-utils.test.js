import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";

import {
  getOrderedDatasetBookIds,
  getRecommendedBookIds,
  getRecommendedBooksByIds,
} from "../src/components/OrderConfirmation/utils.js";

import { installBrowserStubs } from "./testHelpers.js";

const originalRandom = Math.random;

beforeEach(() => {
  installBrowserStubs();
  Math.random = () => 0;
});

afterEach(() => {
  Math.random = originalRandom;
});

test("resolves ordered dataset book ids from mixed order item shapes", () => {
  const books = [
    { id: 1, datasetBookId: "bk-1", title: "Alpha" },
    { id: 2, datasetBookId: "bk-2", title: "Beta" },
    { id: 3, datasetBookId: "bk-3", title: "Gamma" },
  ];

  const order = {
    items: [
      { bookId: 1 },
      { dataset_book_id: "bk-2" },
      { book_id: 3 },
      { id: 3 },
    ],
  };

  assert.deepEqual(getOrderedDatasetBookIds(order, books), ["bk-1", "bk-2", "bk-3"]);
});

test("uses association rules before filling from same author, category, and database-first fallbacks", () => {
  const books = [
    { id: 1, datasetBookId: "bk-1", author: "Author A", category: "Sci-Fi" },
    { id: 2, datasetBookId: "bk-2", author: "Author A", category: "Mystery" },
    { id: 3, datasetBookId: "bk-3", author: "Author B", category: "Sci-Fi" },
    { id: 4, datasetBookId: "bk-4", author: "Author C", category: "Sci-Fi" },
    { id: 5, datasetBookId: "bk-5", author: "Author D", category: "History" },
  ];

  const rules = [
    {
      antecedent: ["bk-1"],
      consequent: ["bk-3"],
      confidence: 1,
      lift: 1,
      support: 1,
    },
  ];

  const recommendedIds = getRecommendedBookIds(["bk-1"], rules, books, 4);
  const recommendedBooks = getRecommendedBooksByIds(recommendedIds, books);

  assert.deepEqual(recommendedIds, ["bk-3", "bk-2", "bk-4", "bk-5"]);
  assert.deepEqual(
    recommendedBooks.map((book) => book.datasetBookId),
    ["bk-3", "bk-2", "bk-4", "bk-5"],
  );
});

test("falls back to same-author matches when no association rule matches", () => {
  const books = [
    { id: 1, datasetBookId: "bk-1", author: "Author A", category: "Sci-Fi" },
    { id: 2, datasetBookId: "bk-2", author: "Author A", category: "Mystery" },
    { id: 3, datasetBookId: "bk-3", author: "Author B", category: "Romance" },
    { id: 4, datasetBookId: "bk-4", author: "Author C", category: "Thriller" },
    { id: 5, datasetBookId: "bk-5", author: "Author D", category: "History" },
  ];

  const recommendedIds = getRecommendedBookIds(["bk-1"], [], books, 4);

  assert.equal(recommendedIds[0], "bk-2");
  assert.equal(recommendedIds.length, 4);
});

test("falls back to category matches before database-first retrieval", () => {
  const books = [
    { id: 1, datasetBookId: "bk-1", author: "Author A", category: "Sci-Fi" },
    { id: 2, datasetBookId: "bk-2", author: "Author B", category: "Sci-Fi" },
    { id: 3, datasetBookId: "bk-3", author: "Author C", category: "Mystery" },
    { id: 4, datasetBookId: "bk-4", author: "Author D", category: "History" },
    { id: 5, datasetBookId: "bk-5", author: "Author E", category: "Poetry" },
  ];

  const recommendedIds = getRecommendedBookIds(["bk-1"], [], books, 4);

  assert.deepEqual(recommendedIds, ["bk-2", "bk-3", "bk-4", "bk-5"]);
});