// Controller layer for user administration requests.
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  createStatus,
  deleteStatus,
  getStatusById,
  listRoles,
  listStatuses,
  updateStatus,
  updateUser,
  userExists,
} from '../models/userModel.js';

// Returns the full user list for administration screens.
export const getUsers = async (_req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// Returns one user by id or a 404 response.
export const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// Creates a new user account when the email and username are unique.
export const createUserHandler = async (req, res, next) => {
  try {
    const { fullName, email, username, password, role, status, termsAccepted, aiEmailOptIn } = req.body;

    const exists = await userExists(username, email);
    if (exists) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const user = await createUser({
      fullName: fullName || username,
      email,
      username,
      password,
      role,
      status,
      termsAccepted,
      aiEmailOptIn,
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

// Updates an existing user after validating uniqueness constraints.
export const updateUserHandler = async (req, res, next) => {
  const userId = Number(req.params.id);
  const updates = req.body || {};

  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const duplicate = await userExists(updates.username, updates.email, userId);
    if (duplicate) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const user = await updateUser(userId, updates);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// Deletes a user unless the account is protected.
export const deleteUserHandler = async (req, res, next) => {
  const userId = Number(req.params.id);
  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (String(existingUser.role || '').toLowerCase() === 'admin') {
      return res.status(403).json({ error: 'Admin account cannot be deleted' });
    }

    await deleteUser(userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Returns the available roles for account management.
export const getRoles = async (_req, res, next) => {
  try {
    const roles = await listRoles();
    res.json({ roles });
  } catch (err) {
    next(err);
  }
};

// Returns the available account statuses.
export const getStatuses = async (_req, res, next) => {
  try {
    const statuses = await listStatuses();
    res.json({ statuses });
  } catch (err) {
    next(err);
  }
};

// Creates a new account status entry.
export const createStatusHandler = async (req, res, next) => {
  try {
    const { status, isActive } = req.body || {};

    const created = await createStatus({ status, isActive });
    res.status(201).json({ status: created });
  } catch (err) {
    if (err.message && err.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Status already exists' });
    }
    next(err);
  }
};

// Updates an existing account status entry.
export const updateStatusHandler = async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const existing = await getStatusById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Status not found' });
    }

    const updated = await updateStatus(id, req.body || {});
    res.json({ status: updated });
  } catch (err) {
    if (err.message && err.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Status already exists' });
    }
    next(err);
  }
};

// Deletes an account status entry when it exists.
export const deleteStatusHandler = async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const existing = await getStatusById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Status not found' });
    }

    const deleted = await deleteStatus(id);
    if (!deleted) {
      return res.status(400).json({ error: 'Unable to delete status' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
