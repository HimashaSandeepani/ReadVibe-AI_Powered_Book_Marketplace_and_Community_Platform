// Community post and interaction API endpoints.
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  addCommentToPost,
  createBookRequestHandler,
  createCommunityPost,
  deleteCommunityPost,
  getBookRequests,
  getCommunityPost,
  getCommunityPosts,
  togglePostLike,
  updateBookRequestStatusHandler,
} from '../controllers/communityController.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/community/posts
// @desc    Get all community posts
// @access  Public
router.get('/posts', getCommunityPosts);

// @route   GET /api/community/posts/:id
// @desc    Get single community post with comments
// @access  Public
router.get(
  '/posts/:id',
  [param('id').isInt().withMessage('Post id must be an integer')],
  handleValidation,
  getCommunityPost
);

// @route   POST /api/community/posts
// @desc    Create community post
// @access  Private (requires userId)
router.post(
  '/posts',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').optional().isString(),
    body('bookTitle').optional().isString(),
  ],
  handleValidation,
  createCommunityPost
);

// @route   DELETE /api/community/posts/:id
// @desc    Delete community post
// @access  Private/Admin (ownership checks TBD)
router.delete(
  '/posts/:id',
  [param('id').isInt().withMessage('Post id must be an integer')],
  handleValidation,
  deleteCommunityPost
);

// @route   POST /api/community/posts/:id/comments
// @desc    Add comment to a post
// @access  Private (requires userId)
router.post(
  '/posts/:id/comments',
  [
    param('id').isInt().withMessage('Post id must be an integer'),
    body('content').trim().notEmpty().withMessage('Content is required'),
  ],
  handleValidation,
  addCommentToPost
);

// @route   POST /api/community/posts/:id/like
// @desc    Toggle like for a post
// @access  Private (requires userId)
router.post(
  '/posts/:id/like',
  [param('id').isInt().withMessage('Post id must be an integer')],
  handleValidation,
  togglePostLike
);

// @route   GET /api/community/requests
// @desc    List book requests (for admin / stock view)
// @access  Private/Admin (auth TBD)
router.get('/requests', getBookRequests);

// @route   POST /api/community/requests
// @desc    Create a new book request
// @access  Private (requires userId)
router.post(
  '/requests',
  [
    body('bookTitle').trim().notEmpty().withMessage('Book title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('isbn').optional().isString(),
    body('category').optional().isString(),
    body('reason').trim().notEmpty().withMessage('Reason is required'),
  ],
  handleValidation,
  createBookRequestHandler
);

// @route   PUT /api/community/requests/:id/status
// @desc    Update status of a book request
// @access  Private/Admin
router.put(
  '/requests/:id/status',
  [
    param('id').isInt().withMessage('Request id must be an integer'),
    body('status').trim().notEmpty().withMessage('Status is required'),
  ],
  handleValidation,
  updateBookRequestStatusHandler
);

export default router;
