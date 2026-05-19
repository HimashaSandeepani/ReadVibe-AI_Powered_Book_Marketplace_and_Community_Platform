// Authentication endpoints for login, signup, and session-related validation.
import express from 'express';
import { body, validationResult } from 'express-validator';

// Builds the authentication router for register, login, and logout flows.
export const createAuthRouter = (model) => {
  const router = express.Router();

  // Validates and normalizes incoming auth payloads.
  // @route   POST /api/auth/register
  // @desc    Register a new user
  // @access  Public
  router.post(
    '/register',
    [
      body('name').trim().notEmpty().withMessage('Full name is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
      body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
      body('role').optional().isString(),
      body('status').optional().isString(),
      body('termsAccepted').optional().isBoolean(),
      body('aiEmailOptIn').optional().isBoolean(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, username, password, role, status, termsAccepted, aiEmailOptIn } = req.body;

      try {
        const exists = await model.userExists(username, email);
        if (exists) {
          return res.status(409).json({ error: 'Username or email already exists' });
        }

        const user = await model.createUser({
          fullName: name,
          email,
          username,
          password,
          role,
          status,
          termsAccepted,
          aiEmailOptIn,
        });
        return res.status(201).json({ user });
      } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ error: 'Failed to register user' });
      }
    },
  );

  // Handles credential checks for user login.
  // @route   POST /api/auth/login
  // @desc    Login user
  // @access  Public
  router.post(
    '/login',
    [
      body('identifier').trim().notEmpty().withMessage('Username or email is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { identifier, password } = req.body;

      try {
        const user = await model.verifyUser(identifier, password);
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        return res.json({ user });
      } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Failed to login' });
      }
    },
  );

  // Returns a lightweight logout acknowledgement.
  // @route   POST /api/auth/logout
  // @desc    Logout user (placeholder for future token blacklisting)
  // @access  Public
  router.post('/logout', (_req, res) => {
    res.json({ message: 'Logged out' });
  });

  return router;
};
