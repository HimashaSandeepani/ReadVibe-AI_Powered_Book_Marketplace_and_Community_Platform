// User account database access helpers and password hashing.
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

const DEFAULT_STATUSES = ['active', 'inactive', 'pending'];
const DEFAULT_ROLES = ['admin', 'user', 'stock'];
const DEFAULT_USERS = [
  {
    fullName: 'Admin User',
    email: 'admin@readvibe.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    status: 'active',
  },
  {
    fullName: 'Stock Manager',
    email: 'stock@readvibe.com',
    username: 'stock',
    password: 'stock123',
    role: 'stock',
    status: 'active',
  },
  {
    fullName: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    password: 'john12345',
    role: 'user',
    status: 'active',
  },
  {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    username: 'janesmith',
    password: 'jane12345',
    role: 'user',
    status: 'active',
  },
];

// Builds the shared user select used by lookup and list queries.
const baseUserSelect = `
  SELECT
    u.user_id,
    u.role_id,
    u.status_id,
    u.full_name,
    u.email,
    u.username,
    u.password_hash,
    u.terms_accepted,
    u.terms_accepted_at,
    u.ai_email_opt_in,
    u.ai_email_opt_in_at,
    u.created_at,
    r.role_name,
    s.status AS status_value
  FROM users u
  LEFT JOIN user_roles r ON u.role_id = r.role_id
  LEFT JOIN status s ON u.status_id = s.id
`;

// Maps a database row into the API user shape.
const mapUserRow = (row) => ({
  id: row.user_id,
  name: row.full_name,
  email: row.email,
  username: row.username,
  role: row.role_name,
  roleId: row.role_id,
  status: row.status_value,
  statusId: row.status_id,
  termsAccepted: row.terms_accepted,
  termsAcceptedAt: row.terms_accepted_at,
  aiEmailOptIn: row.ai_email_opt_in,
  aiEmailOptInAt: row.ai_email_opt_in_at,
  createdAt: row.created_at,
});

// Seeds the default role and status lookup rows.
const seedDefaultLookups = async () => {
  await Promise.all(
    DEFAULT_STATUSES.map((status) =>
      query(
        'INSERT INTO status (status, is_active) VALUES ($1, true) ON CONFLICT (status) DO NOTHING',
        [status]
      )
    )
  );

  await Promise.all(
    DEFAULT_ROLES.map((role) =>
      query(
        'INSERT INTO user_roles (role_name) VALUES ($1) ON CONFLICT (role_name) DO NOTHING',
        [role]
      )
    )
  );
};

// Seeds the default demo users when the database is empty.
const seedDefaultUsers = async () => {
  for (const defaultUser of DEFAULT_USERS) {
    const existing = await query(
      'SELECT user_id FROM users WHERE username = $1 OR email = $2 LIMIT 1',
      [defaultUser.username, defaultUser.email]
    );

    if (existing.rows[0]) continue;

    const passwordHash = await bcrypt.hash(defaultUser.password, 10);
    const roleId = await getRoleId(defaultUser.role);
    const statusId = await getStatusId(defaultUser.status);

    await query(
      `INSERT INTO users (
         role_id,
         status_id,
         full_name,
         email,
         username,
         password_hash,
         terms_accepted,
         terms_accepted_at,
         ai_email_opt_in,
         ai_email_opt_in_at
       ) VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW(), FALSE, NULL)`,
      [
        roleId,
        statusId,
        defaultUser.fullName,
        defaultUser.email,
        defaultUser.username,
        passwordHash,
      ]
    );
  }
};

// Ensures the user, role, and status tables exist.
const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS status (
      id BIGSERIAL PRIMARY KEY,
      status VARCHAR(50) NOT NULL UNIQUE,
      is_active BOOLEAN DEFAULT TRUE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_roles (
      role_id BIGSERIAL PRIMARY KEY,
      role_name VARCHAR(50) UNIQUE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id BIGSERIAL PRIMARY KEY,
      role_id BIGINT REFERENCES user_roles(role_id),
      status_id BIGINT REFERENCES status(id),
      full_name VARCHAR(150),
      email VARCHAR(255) UNIQUE,
      username VARCHAR(50) UNIQUE,
      password_hash TEXT,
      terms_accepted BOOLEAN,
      terms_accepted_at TIMESTAMPTZ,
      ai_email_opt_in BOOLEAN,
      ai_email_opt_in_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await seedDefaultLookups();
  await seedDefaultUsers();
};

ensureTables().catch((err) => {
  console.error('Failed to ensure user-related tables', err);
});

// Looks up a role id, inserting the role when it is missing.
const getRoleId = async (roleName = 'user') => {
  const normalized = (roleName || 'user').toLowerCase();
  const { rows } = await query('SELECT role_id FROM user_roles WHERE LOWER(role_name) = $1 LIMIT 1', [normalized]);

  if (rows[0]) return rows[0].role_id;

  const insert = await query(
    'INSERT INTO user_roles (role_name) VALUES ($1) RETURNING role_id',
    [normalized]
  );
  return insert.rows[0].role_id;
};

// Looks up a status id, inserting the status when it is missing.
const getStatusId = async (statusName = 'active') => {
  const normalized = (statusName || 'active').toLowerCase();
  const { rows } = await query('SELECT id FROM status WHERE LOWER(status) = $1 LIMIT 1', [normalized]);

  if (rows[0]) return rows[0].id;

  const insert = await query(
    'INSERT INTO status (status, is_active) VALUES ($1, TRUE) RETURNING id',
    [normalized]
  );
  return insert.rows[0].id;
};

// Returns the raw user row for a username or email match.
const findRawByUsernameOrEmail = async (identifier) => {
  const { rows } = await query(
    `${baseUserSelect} WHERE u.username = $1 OR u.email = $1 LIMIT 1`,
    [identifier]
  );
  return rows[0] || null;
};

// Returns a user record by username or email.
export const findByUsernameOrEmail = async (identifier) => {
  const row = await findRawByUsernameOrEmail(identifier);
  if (!row) return null;
  return mapUserRow(row);
};

// Checks whether a username or email already exists.
export const userExists = async (username, email, excludeUserId = null) => {
  const params = [username, email];
  const excludeClause = excludeUserId ? 'AND user_id <> $3' : '';
  if (excludeUserId) params.push(excludeUserId);

  const { rows } = await query(
    `SELECT 1 FROM users WHERE (username = $1 OR email = $2) ${excludeClause} LIMIT 1`,
    params
  );
  return rows.length > 0;
};

// Returns all available roles.
export const listRoles = async () => {
  const { rows } = await query('SELECT role_id, role_name FROM user_roles ORDER BY role_name ASC');
  return rows;
};

// Returns all available statuses.
export const listStatuses = async () => {
  const { rows } = await query('SELECT id, status, is_active FROM status ORDER BY status ASC');
  return rows;
};

// Returns one status by id or null when no row exists.
export const getStatusById = async (id) => {
  const { rows } = await query('SELECT id, status, is_active FROM status WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
};

// Creates a new status row.
export const createStatus = async ({ status, isActive = true }) => {
  const name = (status || '').trim();
  if (!name) {
    throw new Error('Status name is required');
  }

  const { rows } = await query(
    'INSERT INTO status (status, is_active) VALUES ($1, $2) RETURNING id, status, is_active',
    [name.toLowerCase(), isActive]
  );

  return rows[0];
};

// Updates a status row and returns the refreshed record.
export const updateStatus = async (id, updates = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.status !== undefined) {
    const name = (updates.status || '').trim();
    if (!name) {
      throw new Error('Status name is required');
    }
    fields.push(`status = $${idx++}`);
    values.push(name.toLowerCase());
  }

  if (updates.isActive !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(!!updates.isActive);
  }

  if (fields.length === 0) {
    return getStatusById(id);
  }

  values.push(id);
  const setClause = fields.join(', ');

  const result = await query(
    `UPDATE status SET ${setClause} WHERE id = $${idx} RETURNING id, status, is_active`,
    values
  );

  return result.rows[0] || null;
};

// Deletes a status row and reports whether anything was removed.
export const deleteStatus = async (id) => {
  const result = await query('DELETE FROM status WHERE id = $1', [id]);
  return result.rowCount > 0;
};

// Returns all users in newest-first order.
export const getAllUsers = async () => {
  const { rows } = await query(`${baseUserSelect} ORDER BY u.created_at DESC`);
  return rows.map(mapUserRow);
};

// Returns one user by id or null when no row exists.
export const getUserById = async (id) => {
  const { rows } = await query(`${baseUserSelect} WHERE u.user_id = $1 LIMIT 1`, [id]);
  if (!rows[0]) return null;
  return mapUserRow(rows[0]);
};

// Creates a new user account and returns the stored record.
export const createUser = async ({
  fullName,
  email,
  username,
  password,
  role = 'user',
  status = 'active',
  termsAccepted = false,
  aiEmailOptIn = false,
}) => {
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const roleId = await getRoleId(role);
  const statusId = await getStatusId(status);

  const termsAcceptedAt = termsAccepted ? new Date() : null;
  const aiEmailOptInAt = aiEmailOptIn ? new Date() : null;

  const { rows } = await query(
    `INSERT INTO users (
        role_id,
        status_id,
        full_name,
        email,
        username,
        password_hash,
        terms_accepted,
        terms_accepted_at,
        ai_email_opt_in,
        ai_email_opt_in_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING user_id`,
    [
      roleId,
      statusId,
      fullName || username,
      email,
      username,
      passwordHash,
      termsAccepted,
      termsAcceptedAt,
      aiEmailOptIn,
      aiEmailOptInAt,
    ]
  );

  return getUserById(rows[0].user_id);
};

// Updates the requested user fields and returns the refreshed record.
export const updateUser = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.fullName !== undefined) {
    fields.push(`full_name = $${idx++}`);
    values.push(updates.fullName);
  }

  if (updates.email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(updates.email);
  }

  if (updates.username !== undefined) {
    fields.push(`username = $${idx++}`);
    values.push(updates.username);
  }

  if (updates.password) {
    const hashed = await bcrypt.hash(updates.password, 10);
    fields.push(`password_hash = $${idx++}`);
    values.push(hashed);
  }

  if (updates.role) {
    const roleId = await getRoleId(updates.role);
    fields.push(`role_id = $${idx++}`);
    values.push(roleId);
  }

  if (updates.status) {
    const statusId = await getStatusId(updates.status);
    fields.push(`status_id = $${idx++}`);
    values.push(statusId);
  }

  if (updates.termsAccepted !== undefined) {
    fields.push(`terms_accepted = $${idx++}`);
    values.push(updates.termsAccepted);
    fields.push(`terms_accepted_at = $${idx++}`);
    values.push(updates.termsAccepted ? new Date() : null);
  }

  if (updates.aiEmailOptIn !== undefined) {
    fields.push(`ai_email_opt_in = $${idx++}`);
    values.push(updates.aiEmailOptIn);
    fields.push(`ai_email_opt_in_at = $${idx++}`);
    values.push(updates.aiEmailOptIn ? new Date() : null);
  }

  if (fields.length === 0) {
    return getUserById(id);
  }

  values.push(id);
  const setClause = fields.join(', ');

  await query(`UPDATE users SET ${setClause} WHERE user_id = $${idx}`, values);
  return getUserById(id);
};

// Deletes a user by id.
export const deleteUser = async (id) => {
  await query('DELETE FROM users WHERE user_id = $1', [id]);
};

// Verifies a login identifier and password hash.
export const verifyUser = async (identifier, password) => {
  const user = await findRawByUsernameOrEmail(identifier);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password_hash || '');
  if (!isMatch) return null;

  return mapUserRow(user);
};
