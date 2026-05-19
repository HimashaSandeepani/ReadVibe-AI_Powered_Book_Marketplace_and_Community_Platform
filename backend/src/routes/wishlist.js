// Wishlist API endpoints.
import express from 'express';
import { body, param, validationResult } from 'express-validator';

// Builds the wishlist router with user-scoped wishlist operations.
export const createWishlistRouter = (controller) => {
  const router = express.Router();

  // Resolves the current user id from request headers, query, or body.
  const getUserId = (req) => {
    const raw = req.headers['x-user-id'] || req.query.userId || req.body.userId;
    const parsed = Number(raw);
    return Number.isInteger(parsed) ? parsed : null;
  };

  // Ensures a request has a usable user id before hitting wishlist handlers.
  const requireUser = (req, res, next) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    req.userId = userId;
    next();
  };

  // Returns a 400 response when wishlist validation fails.
  const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

  // Checks whether a value can be safely interpreted as an integer.
  const isIntegerLike = (value) => Number.isInteger(Number(value));

  // @route   GET /api/wishlist
  router.get('/', requireUser, controller.getWishlist);

  // @route   POST /api/wishlist
  router.post(
    '/',
    requireUser,
    [
      body('bookId').custom((value) => isIntegerLike(value)).withMessage('bookId is required'),
      body('priority').optional().custom((value) => isIntegerLike(value) && Number(value) >= 1 && Number(value) <= 5).withMessage('priority must be 1-5'),
      body('notes').optional().isString(),
    ],
    handleValidation,
    controller.addWishlist,
  );

  // @route   PUT /api/wishlist/:bookId
  router.put(
    '/:bookId',
    requireUser,
    [
      param('bookId').custom((value) => isIntegerLike(value)).withMessage('bookId must be an integer'),
      body('priority').optional().custom((value) => isIntegerLike(value) && Number(value) >= 1 && Number(value) <= 5).withMessage('priority must be 1-5'),
      body('notes').optional().isString(),
    ],
    handleValidation,
    controller.updateWishlist,
  );

  // @route   DELETE /api/wishlist/:bookId
  router.delete(
    '/:bookId',
    requireUser,
    [param('bookId').custom((value) => isIntegerLike(value)).withMessage('bookId must be an integer')],
    handleValidation,
    controller.deleteWishlist,
  );

  // @route   DELETE /api/wishlist
  router.delete('/', requireUser, controller.clearWishlistHandler);

  return router;
};
