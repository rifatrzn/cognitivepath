/**
 * Routes Index
 * Main router configuration
 */

const express = require('express');
const router = express.Router();
const config = require('../config');
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: config.apiVersion,
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);

module.exports = router;




