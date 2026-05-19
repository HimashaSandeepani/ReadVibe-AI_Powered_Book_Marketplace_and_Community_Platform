// Email-triggering API endpoints for order notifications.
import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendOrderConfirmationEmail } from '../utils/email.js';

const router = express.Router();

// Returns a 400 response when email route validation fails.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/send-order-email',
  [
    body('to').optional().isString().trim().notEmpty().withMessage('to must be a non-empty string'),
    body('customerName').optional().isString(),
    body('order')
      .optional()
      .custom((value) => value && typeof value === 'object' && !Array.isArray(value)),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { to, customerName, order } = req.body || {};
      const result = await sendOrderConfirmationEmail({ to, customerName, order });
      return res.json(result);
    } catch (error) {
      console.error('Failed to send order confirmation email', error);
      return res.status(500).json({
        sent: false,
        messageId: null,
        error: 'Failed to send order confirmation email',
      });
    }
  },
);

export default router;