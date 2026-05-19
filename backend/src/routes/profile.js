// User profile API endpoints.
import express from 'express';
import { body, validationResult, param } from 'express-validator';
import {
  createMyReview,
  deleteMyReview,
  getMyReviews,
  getProfileSummary,
  updateProfile,
} from '../controllers/profileController.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/profile
// @desc    Get profile summary for current user
// @access  Private (requires userId via header/query/body)
router.get('/', getProfileSummary);

// @route   PUT /api/profile
// @desc    Update basic profile info for current user
// @access  Private
router.put(
  '/',
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fullName').optional().isString(),
    body('termsAccepted').optional().isBoolean(),
    body('aiEmailOptIn').optional().isBoolean(),
  ],
  handleValidation,
  updateProfile
);

// @route   GET /api/profile/reviews
// @desc    List reviews for current user
// @access  Private
router.get('/reviews', getMyReviews);

// @route   POST /api/profile/reviews
// @desc    Create a new review for current user
// @access  Private
router.post(
  '/reviews',
  [
    body('bookId').isInt().withMessage('bookId is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be 1-5'),
    body('text').trim().notEmpty().withMessage('Review text is required'),
    body('title').optional().isString(),
    body('recommend').optional().isBoolean(),
    body('orderId').optional().isInt(),
  ],
  handleValidation,
  createMyReview
);

// @route   DELETE /api/profile/reviews/:id
// @desc    Delete a review for current user
// @access  Private
router.delete(
  '/reviews/:id',
  [param('id').isInt().withMessage('Review id must be an integer')],
  handleValidation,
  deleteMyReview
);

export default router;
