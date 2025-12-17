/**
 * Patient Controller
 * Handles patient-related operations
 */

const { Patient } = require('../models');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

/**
 * Get all patients
 */
const getPatients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filters = {};

  // Apply filters based on user role
  if (req.user.role === 'provider') {
    filters.provider_id = req.user.id;
  }

  if (req.query.risk_level) {
    filters.risk_level = req.query.risk_level;
  }

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const patients = await Patient.findAll(filters, page, limit);
  const total = await Patient.count(filters);

  res.json({
    success: true,
    data: {
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * Get patient by ID
 */
const getPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Check authorization
  if (req.user.role === 'provider' && patient.provider_id !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  res.json({
    success: true,
    data: { patient },
  });
});

/**
 * Create new patient
 */
const createPatient = asyncHandler(async (req, res) => {
  const patientData = {
    ...req.body,
    provider_id: req.user.role === 'provider' ? req.user.id : req.body.provider_id,
  };

  const patient = await Patient.create(patientData);

  logger.info('Patient created', { patientId: patient.id, providerId: req.user.id });

  res.status(201).json({
    success: true,
    message: 'Patient created successfully',
    data: { patient },
  });
});

/**
 * Update patient
 */
const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Check authorization
  if (req.user.role === 'provider' && patient.provider_id !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  const updatedPatient = await Patient.update(id, req.body);

  logger.info('Patient updated', { patientId: id, providerId: req.user.id });

  res.json({
    success: true,
    message: 'Patient updated successfully',
    data: { patient: updatedPatient },
  });
});

/**
 * Delete patient
 */
const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Only admins can delete patients.', 403);
  }

  await Patient.delete(id);

  logger.info('Patient deleted', { patientId: id, userId: req.user.id });

  res.json({
    success: true,
    message: 'Patient deleted successfully',
  });
});

module.exports = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
};




