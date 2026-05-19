// Book catalog API endpoints and validation rules.
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createBookHandler,
  deleteBookHandler,
  getBook,
  getBooks,
  updateBookHandler,
} from '../controllers/bookController.js';

const router = express.Router();

// Returns a 400 response when book route validation fails.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Public
router.get(
  '/:id',
  [param('id').isInt().withMessage('Book id must be an integer')],
  handleValidation,
  getBook
);

// @route   POST /api/books
// @desc    Create a new book
// @access  Private/Stock Manager/Admin (auth TBD)
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isNumeric().withMessage('Price is required'),
    body('datasetBookId').optional().trim().matches(/^[A-Za-z0-9_-]+$/).withMessage('Dataset book id must contain only letters, numbers, hyphens, or underscores'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be integer'),
    body('minStock').optional().isInt({ min: 0 }),
    body('maxStock').optional().isInt({ min: 0 }),
    body('featured').optional().isBoolean(),
  ],
  handleValidation,
  createBookHandler
);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private/Stock Manager/Admin (auth TBD)
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Book id must be an integer'),
    body('price').optional().isNumeric(),
    body('stock').optional().isInt({ min: 0 }),
    body('minStock').optional().isInt({ min: 0 }),
    body('maxStock').optional().isInt({ min: 0 }),
    body('featured').optional().isBoolean(),
  ],
  handleValidation,
  updateBookHandler
);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private/Stock Manager/Admin (auth TBD)
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Book id must be an integer')],
  handleValidation,
  deleteBookHandler
);

export default router;
