/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

const logger = require('../config/logger');
const config = require('../config');

/**
 * Custom Application Error
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  if (err.statusCode >= 500) {
    logger.error('Server error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn('Client error', {
      error: err.message,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  // Send error response
  if (config.env === 'development') {
    // Detailed error in development
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
      ...(err.errors && { errors: err.errors }),
    });
  } else {
    // Generic error in production
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        error: err.message,
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      // Programming or unknown error
      res.status(500).json({
        success: false,
        error: 'Something went wrong. Please try again later.',
      });
    }
  }
};

/**
 * Handle 404 errors
 */
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};

/**
 * Async error wrapper - catches async errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
};




