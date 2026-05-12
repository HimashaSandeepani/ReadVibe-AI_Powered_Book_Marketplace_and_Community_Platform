import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import {
  getCurrentUser,
  getUserRole,
  isAdmin,
  isAuthenticated,
  isPrivilegedUser,
  isRegularUser,
  isStockManager,
  logout,
  setCurrentUser,
} from "../src/utils/auth.js";

import { installBrowserStubs } from "./testHelpers.js";

beforeEach(() => {
  installBrowserStubs();
});

test("normalizes alternate user id fields before storage", () => {
  setCurrentUser({ userID: "42", role: "admin", name: "Ada" });

  const currentUser = getCurrentUser();

  assert.equal(currentUser.id, 42);
  assert.equal(currentUser.role, "admin");
  assert.equal(getUserRole(), "admin");
  assert.equal(Boolean(isAuthenticated()), true);
  assert.equal(Boolean(isAdmin()), true);
  assert.equal(Boolean(isPrivilegedUser()), true);
  assert.equal(Boolean(isRegularUser()), false);
  assert.equal(Boolean(isStockManager()), false);
});

test("detects stock managers and logs out cleanly", () => {
  setCurrentUser({ user_id: 7, role: "stock" });

  assert.equal(Boolean(isAuthenticated()), true);
  assert.equal(Boolean(isStockManager()), true);
  assert.equal(Boolean(isPrivilegedUser()), true);

  logout();

  assert.equal(Boolean(isAuthenticated()), false);
  assert.equal(getCurrentUser(), null);
  assert.equal(getUserRole(), null);
});

test("treats regular users as authenticated but not privileged", () => {
  setCurrentUser({ id: 13, role: "user" });

  assert.equal(Boolean(isAuthenticated()), true);
  assert.equal(Boolean(isRegularUser()), true);
  assert.equal(Boolean(isAdmin()), false);
  assert.equal(Boolean(isStockManager()), false);
  assert.equal(Boolean(isPrivilegedUser()), false);
});