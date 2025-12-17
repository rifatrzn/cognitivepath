/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/security');

// Public routes
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;




