// Controller layer for order processing and tracking requests.
import { createOrder, getAllOrders, getOrderById, getOrdersForUser, updateOrderStatus, updateOrderTracking } from '../models/orderModel.js';
import { getUserById } from '../models/userModel.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

// Extracts the current user id and raises a 400 error when missing.
const ensureUser = (req) => {
  if (!req.userId) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }
  return req.userId;
};

// Creates a new order and triggers the confirmation email flow.
export const createOrderHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const { items, shipping, shippingMethod, shippingCost } = req.body || {};

    const order = await createOrder({
      userId,
      items,
      shipping,
      shippingMethod,
      shippingCost,
    });

    const user = await getUserById(userId);
    if (user?.email) {
      sendOrderConfirmationEmail({
        to: shipping?.email || user.email,
        customerName: shipping?.firstName
          ? `${shipping.firstName} ${shipping.lastName || ''}`.trim()
          : user.name,
        order,
      }).catch((error) => {
        console.error('Failed to send order confirmation email', error);
      });
    }

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

// Returns the current user's orders.
export const getOrdersHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const orders = await getOrdersForUser(userId);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// Returns all orders for admin and stock dashboards.
export const getAllOrdersHandler = async (_req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// Returns one order when it belongs to the current user.
export const getOrderHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const orderId = Number(req.params.id);
    const order = await getOrderById(orderId);
    const orderUserId = Number(order?.userId);

    if (!order || orderUserId !== userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// Updates the fulfillment status for an order.
export const updateOrderStatusHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body || {};
    const order = await updateOrderStatus(orderId, status);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// Updates tracking metadata for an order.
export const updateOrderTrackingHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { status, note, location, courier, trackingNumber } = req.body || {};
    const order = await updateOrderTracking(orderId, {
      status,
      note,
      location,
      courier,
      trackingNumber,
      updatedBy: req.body?.updatedBy,
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
