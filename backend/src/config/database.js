// PostgreSQL connection configuration and query helpers for the backend.
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // prefer single URL when provided
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'readvibe_db',
  user: process.env.DB_USER || 'readvibe',
  password: process.env.DB_PASSWORD || 'readvibe_password',
  max: Number(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => console.log('Connected to PostgreSQL database'));
pool.on('error', (err) => console.error('Unexpected error on idle client', err));

// Verifies the database connection with retries during startup.
const testConnection = async (attempt = 1) => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection verified');
  } catch (err) {
    console.error('Database connection failed', err);
    if (attempt < 5) {
      setTimeout(() => {
        void testConnection(attempt + 1);
      }, 2000);
    }
  }
};

void testConnection();

// Runs a SQL query against the shared connection pool.
export const query = (text, params) => pool.query(text, params);
export default pool;