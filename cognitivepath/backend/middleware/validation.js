/**
 * Validation Middleware
 * Input validation and sanitization
 */

const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Validate request and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errorMessages,
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['patient', 'provider', 'coordinator', 'admin'])
    .withMessage('Invalid role'),
  validate,
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

/**
 * Validation rules for patient creation
 */
const validatePatient = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be between 18 and 120'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  validate,
];

/**
 * Validation rules for assessment analysis
 */
const validateAssessment = [
  body('transcript')
    .optional()
    .isString()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Transcript must be between 10 and 10000 characters'),
  body('audioUrl')
    .optional()
    .isURL()
    .withMessage('Audio URL must be a valid URL'),
  body('patientId')
    .isInt()
    .withMessage('Patient ID must be a valid integer'),
  validate,
];

/**
 * Validation rules for ID parameters
 */
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  validate,
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validatePatient,
  validateAssessment,
  validateId,
};




