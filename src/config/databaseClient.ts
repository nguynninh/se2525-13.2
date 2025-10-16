import { Pool } from 'pg';
import { dbConfig } from './database';

export const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.name,
  ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
});

export const connectDatabase = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to database at:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
};