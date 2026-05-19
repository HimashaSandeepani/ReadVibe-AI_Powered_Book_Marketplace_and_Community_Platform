// Controller layer for shopping cart requests.
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCartForUser,
  updateCartItem,
} from '../models/cartModel.js';

// Extracts the current user id and fails fast when it is missing.
const ensureUser = (req) => {
  if (!req.userId) {
    throw new Error('userId is required');
  }
  return req.userId;
};

// Returns the current user's cart items.
export const getCart = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await getCartForUser(userId);
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

// Adds an item to the current user's cart.
export const addCartItem = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await addToCart(userId, Number(req.body.bookId), Number(req.body.quantity) || 1);
    res.status(201).json({ items });
  } catch (err) {
    next(err);
  }
};

// Updates the quantity for a cart item.
export const updateCartItemHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const items = await updateCartItem(userId, Number(req.params.bookId), Number(req.body.quantity));
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

// Removes a single item from the cart and returns the updated cart.
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

// Clears every item from the current user's cart.
export const clearCartHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    await clearCart(userId);
    res.json({ items: [] });
  } catch (err) {
    next(err);
  }
};
