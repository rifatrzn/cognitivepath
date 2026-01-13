/**
 * Database Configuration
 * Handles PostgreSQL connection setup and management
 */

const { Pool } = require('pg');
const logger = require('./logger');

class Database {
  constructor() {
    this.pool = null;
  }

  /**
   * Initialize database connection pool
   */
  async connect() {
    try {
      this.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'cognitivepath',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      logger.info('Database connected successfully');
      return this.pool;
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Get database pool
   */
  getPool() {
    if (!this.pool) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.pool;
  }

  /**
   * Execute a query
   */
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      logger.error('Query error', { text, error: error.message });
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      logger.info('Database connection closed');
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const result = await this.pool.query('SELECT 1 as health');
      return { status: 'healthy', database: 'connected' };
    } catch (error) {
      return { status: 'unhealthy', database: 'disconnected', error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new Database();





