/**
 * CognitivePath Backend Server
 * Main application entry point
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./config/logger');
const db = require('./config/database');
const routes = require('./routes');
const { securityHeaders, generalLimiter, corsConfig } = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(cors(corsConfig));
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Connect to database
    await db.connect();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`, {
        env: config.env,
        apiVersion: config.apiVersion,
      });
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await db.close();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection', err);
      gracefulShutdown('unhandledRejection');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception', err);
      gracefulShutdown('uncaughtException');
    });

  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
