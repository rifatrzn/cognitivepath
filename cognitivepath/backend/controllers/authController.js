/**
 * Authentication Controller
 * Handles user registration, login, and token management
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const config = require('../config');
const logger = require('../config/logger');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Register a new user
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name,
    role: role || 'patient',
  });

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  logger.info('User registered', { userId: user.id, email });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});

/**
 * Login user
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.is_active) {
    throw new AppError('Account is deactivated. Please contact administrator.', 403);
  }

  // Verify password
  const isPasswordValid = await User.verifyPassword(user, password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  logger.info('User logged in', { userId: user.id, email });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});

/**
 * Refresh access token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.is_active) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new access token
    const newToken = generateToken(user.id);

    res.json({
      success: true,
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired. Please login again.', 401);
    }
    throw new AppError('Invalid refresh token', 401);
  }
});

/**
 * Get current user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
      },
    },
  });
});

/**
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const updates = {};

  if (name) {
    updates.name = name;
  }

  const user = await User.update(req.user.id, updates);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  });
});

/**
 * Change password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  // Get user with password
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await User.verifyPassword(user, currentPassword);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  await User.updatePassword(req.user.id, newPassword);

  logger.info('Password changed', { userId: req.user.id });

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
};





