// Controller layer for wishlist requests.
import {
  addWishlistItem,
  clearWishlist,
  deleteWishlistItem,
  getWishlistForUser,
  updateWishlistItem,
} from '../models/wishlistModel.js';

const ensureUser = (req) => {
  if (!req.userId) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }
  return req.userId;
};

export const getWishlist = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await getWishlistForUser(userId);
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const addWishlist = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await addWishlistItem(
      userId,
      Number(req.body.bookId),
      req.body.priority ?? 3,
      req.body.notes ?? null
    );
    res.status(201).json({ items });
  } catch (err) {
    next(err);
  }
};

export const updateWishlist = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await updateWishlistItem(userId, Number(req.params.bookId), {
      priority: req.body.priority,
      notes: req.body.notes,
    });
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const deleteWishlist = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await deleteWishlistItem(userId, Number(req.params.bookId));
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const clearWishlistHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    await clearWishlist(userId);
    res.json({ items: [] });
  } catch (err) {
    next(err);
  }
};
