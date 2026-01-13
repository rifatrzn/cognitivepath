/**
 * Database Wait Script
 * Waits for PostgreSQL to be ready before running migrations or starting server
 */

const { Pool } = require('pg');

const maxRetries = 30;
const retryDelay = 2000; // 2 seconds

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cognitivepath',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  connectionTimeoutMillis: 2000,
});

async function waitForDatabase() {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('✓ Database is ready!');
      await pool.end();
      return true;
    } catch (error) {
      console.log(`Waiting for database... (${i + 1}/${maxRetries})`);
      if (i === maxRetries - 1) {
        console.error('✗ Database connection failed after maximum retries');
        await pool.end();
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

waitForDatabase().then(success => {
  process.exit(success ? 0 : 1);
});

