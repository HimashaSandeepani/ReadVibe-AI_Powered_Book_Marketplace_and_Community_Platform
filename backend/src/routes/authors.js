// Author management API endpoints.
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createAuthorHandler,
  deleteAuthorHandler,
  getAuthor,
  getAuthors,
  updateAuthorHandler,
} from '../controllers/authorController.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/authors
// @desc    List all authors
router.get('/', getAuthors);

// @route   GET /api/authors/:id
// @desc    Get single author
router.get(
  '/:id',
  [param('id').isInt().withMessage('Author id must be an integer')],
  handleValidation,
  getAuthor
);

// @route   POST /api/authors
// @desc    Create author
router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Name is required')],
  handleValidation,
  createAuthorHandler
);

// @route   PUT /api/authors/:id
// @desc    Update author
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Author id must be an integer'),
    body('name').optional().isString(),
  ],
  handleValidation,
  updateAuthorHandler
);

// @route   DELETE /api/authors/:id
// @desc    Delete author
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Author id must be an integer')],
  handleValidation,
  deleteAuthorHandler
);

export default router;
