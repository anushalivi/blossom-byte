import { Pool } from 'pg';
import { getConfig } from './config.js';

const NEON_DEFAULT_URL = 'postgresql://neondb_owner:npg_cEqrFLahQ9e0@ep-bitter-boat-b43kti0i-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Global cache for connection pool across Next.js reloads
let cachedPool = global.pgPool;

if (!cachedPool) {
  cachedPool = global.pgPool = null;
}

export function getPool() {
  if (cachedPool) {
    return cachedPool;
  }

  const config = getConfig();
  const connectionString = (config && config.dbUri && config.dbUri.startsWith('postgres'))
    ? config.dbUri
    : (process.env.DATABASE_URL || process.env.POSTGRES_URL || NEON_DEFAULT_URL);

  cachedPool = global.pgPool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: false
    }
  });

  cachedPool.on('error', (err) => {
    console.error('Unexpected error on idle Neon PG client', err);
  });

  return cachedPool;
}

export async function connectDB() {
  try {
    const pool = getPool();
    // Test simple connectivity query
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return pool;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Neon PostgreSQL connection error:', err.message);
    throw err;
  }
}

export async function query(text, params) {
  const pool = getPool();
  return pool.query(text, params);
}
