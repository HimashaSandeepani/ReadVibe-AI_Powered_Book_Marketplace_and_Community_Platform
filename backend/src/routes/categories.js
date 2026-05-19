// Book category API endpoints.
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategories,
  getCategory,
  updateCategoryHandler,
} from '../controllers/categoryController.js';

const router = express.Router();

// Returns a 400 response when category route validation fails.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/categories
// @desc    List all categories
router.get('/', getCategories);

// @route   GET /api/categories/:id
// @desc    Get single category
router.get(
  '/:id',
  [param('id').isInt().withMessage('Category id must be an integer')],
  handleValidation,
  getCategory
);

// @route   POST /api/categories
// @desc    Create category
router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Name is required')],
  handleValidation,
  createCategoryHandler
);

// @route   PUT /api/categories/:id
// @desc    Update category
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Category id must be an integer'),
    body('name').optional().isString(),
  ],
  handleValidation,
  updateCategoryHandler
);

// @route   DELETE /api/categories/:id
// @desc    Delete category
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Category id must be an integer')],
  handleValidation,
  deleteCategoryHandler
);

export default router;
