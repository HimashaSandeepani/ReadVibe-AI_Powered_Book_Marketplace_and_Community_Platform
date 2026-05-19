// User administration API endpoints.
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createUserHandler,
  deleteUserHandler,
  getRoles,
  getStatuses,
  getUser,
  getUsers,
   createStatusHandler,
   updateStatusHandler,
   deleteStatusHandler,
  updateUserHandler,
} from '../controllers/userController.js';

const router = express.Router();

// Returns a 400 response when user route validation fails.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', getUsers);

router.get('/roles', getRoles);

router.get('/statuses', getStatuses);

router.post(
  '/statuses',
  [
    body('status').isLength({ min: 1 }).withMessage('Status name is required'),
    body('isActive').optional().isBoolean(),
  ],
  handleValidation,
  createStatusHandler
);

router.put(
  '/statuses/:id',
  [
    param('id').isInt().withMessage('Status id must be an integer'),
    body('status').optional().isLength({ min: 1 }).withMessage('Status name cannot be empty'),
    body('isActive').optional().isBoolean(),
  ],
  handleValidation,
  updateStatusHandler
);

router.delete(
  '/statuses/:id',
  [param('id').isInt().withMessage('Status id must be an integer')],
  handleValidation,
  deleteStatusHandler
);

// @route   GET /api/users/:id
// @desc    Get single user by id
router.get(
  '/:id',
  [param('id').isInt().withMessage('User id must be an integer')],
  handleValidation,
  getUser
);

// @route   POST /api/users
// @desc    Create a new user
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isString(),
    body('status').optional().isString(),
    body('fullName').optional().isString(),
    body('termsAccepted').optional().isBoolean(),
    body('aiEmailOptIn').optional().isBoolean(),
  ],
  handleValidation,
  createUserHandler
);

// @route   PUT /api/users/:id
// @desc    Update an existing user
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('User id must be an integer'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isString(),
    body('status').optional().isString(),
    body('fullName').optional().isString(),
    body('termsAccepted').optional().isBoolean(),
    body('aiEmailOptIn').optional().isBoolean(),
  ],
  handleValidation,
  updateUserHandler
);

// @route   DELETE /api/users/:id
// @desc    Delete user
router.delete(
  '/:id',
  [param('id').isInt().withMessage('User id must be an integer')],
  handleValidation,
  deleteUserHandler
);

export default router;
