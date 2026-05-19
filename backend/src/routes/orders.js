// Order management API endpoints.
import express from 'express';
import { body, param, validationResult } from 'express-validator';

// Builds the order router for customer and manager order workflows.
export const createOrdersRouter = (controller) => {
  const router = express.Router();

  // Resolves the current user id from request headers, query, or body.
  const getUserId = (req) => {
    const raw = req.headers['x-user-id'] || req.query.userId || req.body.userId;
    const parsed = Number(raw);
    return Number.isInteger(parsed) ? parsed : null;
  };

  // Ensures a request has a usable user id before hitting order handlers.
  const requireUser = (req, res, next) => {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    req.userId = userId;
    next();
  };

  // Returns a 400 response when request validation fails.
  const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

  // Checks whether a value can be safely interpreted as an integer.
  const isIntegerLike = (value) => Number.isInteger(Number(value));

  // @route   GET /api/orders
  // @desc    Get user orders
  router.get('/', requireUser, controller.getOrdersHandler);

  // @route   GET /api/orders/all
  // @desc    Get all orders for stock/admin dashboards
  router.get('/all', controller.getAllOrdersHandler);

  // @route   POST /api/orders
  // @desc    Create new order
  router.post(
    '/',
    requireUser,
    [
      body('items').isArray({ min: 1 }).withMessage('items array is required'),
      body('items.*.bookId').custom((value) => isIntegerLike(value)).withMessage('bookId must be an integer'),
      body('items.*.quantity').optional().custom((value) => isIntegerLike(value) && Number(value) >= 1).withMessage('quantity must be at least 1'),
      body('shippingMethod').optional().isString(),
      body('shippingCost').optional().isNumeric(),
    ],
    handleValidation,
    controller.createOrderHandler,
  );

  // @route   GET /api/orders/:id
  // @desc    Get order by ID
  router.get(
    '/:id',
    requireUser,
    [param('id').custom((value) => isIntegerLike(value)).withMessage('Order id must be an integer')],
    handleValidation,
    controller.getOrderHandler,
  );

  // @route   PUT /api/orders/:id/status
  // @desc    Update order status
  router.put(
    '/:id/status',
    [
      param('id').custom((value) => isIntegerLike(value)).withMessage('Order id must be an integer'),
      body('status').trim().notEmpty().withMessage('status is required'),
    ],
    handleValidation,
    controller.updateOrderStatusHandler,
  );

  // @route   PUT /api/orders/:id/tracking
  // @desc    Update order tracking details
  router.put(
    '/:id/tracking',
    [
      param('id').custom((value) => isIntegerLike(value)).withMessage('Order id must be an integer'),
      body('status').trim().notEmpty().withMessage('status is required'),
      body('note').optional().isString(),
      body('location').optional().isString(),
      body('courier').optional().isString(),
      body('trackingNumber').optional().isString(),
    ],
    handleValidation,
    controller.updateOrderTrackingHandler,
  );

  return router;
};
