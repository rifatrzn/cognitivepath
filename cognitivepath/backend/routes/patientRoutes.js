/**
 * Patient Routes
 */

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');
const { validatePatient, validateId } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/security');

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.get('/', patientController.getPatients);
router.get('/:id', validateId, patientController.getPatient);
router.post('/', authorize('provider', 'admin'), validatePatient, patientController.createPatient);
router.put('/:id', validateId, patientController.updatePatient);
router.delete('/:id', validateId, authorize('admin'), patientController.deletePatient);

module.exports = router;




