import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import {
  getHomeFeaturedCommunityPostIds,
  resolveHomeFeaturedCommunityPosts,
  saveHomeFeaturedCommunityPostIds,
} from "../src/utils/homeFeaturedCommunityPosts.js";

import { installBrowserStubs } from "./testHelpers.js";

beforeEach(() => {
  installBrowserStubs();
});

test("saveHomeFeaturedCommunityPostIds deduplicates and limits stored ids", () => {
  const savedIds = saveHomeFeaturedCommunityPostIds([" 12 ", 12, "34", "", "56"]);

  assert.deepEqual(savedIds, ["12", "34"]);
  assert.equal(
    window.localStorage.getItem("homeFeaturedCommunityPostIds"),
    JSON.stringify(["12", "34"]),
  );
});

test("getHomeFeaturedCommunityPostIds normalizes ids from storage", () => {
  window.localStorage.setItem(
    "homeFeaturedCommunityPostIds",
    JSON.stringify([" 11 ", null, "22", ""]),
  );

  assert.deepEqual(getHomeFeaturedCommunityPostIds(), ["11", "22"]);
});

test("resolveHomeFeaturedCommunityPosts prefers selected ids and fills from recency", () => {
  const posts = [
    { id: 1, title: "Oldest", createdAt: "2026-05-10T10:00:00.000Z" },
    { id: 2, title: "Selected", createdAt: "2026-05-11T10:00:00.000Z" },
    { id: 3, title: "Newest", timestamp: "2026-05-12T10:00:00.000Z" },
  ];

  const resolvedPosts = resolveHomeFeaturedCommunityPosts(posts, [2, 99]);

  assert.deepEqual(
    resolvedPosts.map((post) => post.id),
    [2, 3],
  );
});