// Publisher management API endpoints.
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createPublisherHandler,
  deletePublisherHandler,
  getPublisher,
  getPublishers,
  updatePublisherHandler,
} from '../controllers/publisherController.js';

const router = express.Router();

// Returns a 400 response when publisher route validation fails.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/publishers
// @desc    List all publishers
router.get('/', getPublishers);

// @route   GET /api/publishers/:id
// @desc    Get single publisher
router.get(
  '/:id',
  [param('id').isInt().withMessage('Publisher id must be an integer')],
  handleValidation,
  getPublisher
);

// @route   POST /api/publishers
// @desc    Create a publisher
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().isString(),
    body('address').optional().isString(),
  ],
  handleValidation,
  createPublisherHandler
);

// @route   PUT /api/publishers/:id
// @desc    Update a publisher
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Publisher id must be an integer'),
    body('name').optional().isString(),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().isString(),
    body('address').optional().isString(),
  ],
  handleValidation,
  updatePublisherHandler
);

// @route   DELETE /api/publishers/:id
// @desc    Delete a publisher
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Publisher id must be an integer')],
  handleValidation,
  deletePublisherHandler
);

export default router;
