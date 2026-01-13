/**
 * Configuration Module
 * Centralized configuration management
 */

require('dotenv').config();

const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'cognitivepath',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000'],
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    sessionSecret: process.env.SESSION_SECRET || 'change-this-session-secret',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  // API Keys
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    fhirServerUrl: process.env.FHIR_SERVER_URL,
  },
};

// Validate required environment variables in production
if (config.env === 'production') {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DB_PASSWORD', 'SESSION_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = config;





