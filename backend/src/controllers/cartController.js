// Controller layer for shopping cart requests.
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCartForUser,
  updateCartItem,
} from '../models/cartModel.js';

const ensureUser = (req) => {
  if (!req.userId) {
    throw new Error('userId is required');
  }
  return req.userId;
};

export const getCart = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await getCartForUser(userId);
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const addCartItem = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await addToCart(userId, Number(req.body.bookId), Number(req.body.quantity) || 1);
    res.status(201).json({ items });
  } catch (err) {
    next(err);
  }
};

export const updateCartItemHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await updateCartItem(userId, Number(req.params.bookId), Number(req.body.quantity));
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const deleteCartItemHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    await deleteCartItem(userId, Number(req.params.bookId));
    const items = await getCartForUser(userId);
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const clearCartHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    await clearCart(userId);
    res.json({ items: [] });
  } catch (err) {
    next(err);
  }
};
