/**
 * Patient API Tests
 */

const request = require('supertest');
const app = require('../server');
const { User, Patient } = require('../models');
const db = require('../config/database');

describe('Patient API', () => {
  let providerToken;
  let providerId;
  let patientId;

  beforeAll(async () => {
    await db.connect();

    // Create a provider user for testing
    const provider = await User.create({
      email: 'provider@test.com',
      password: 'Test1234!',
      name: 'Test Provider',
      role: 'provider',
    });
    providerId = provider.id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'provider@test.com',
        password: 'Test1234!',
      });
    providerToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    // Clean up
    if (patientId) {
      await db.query('DELETE FROM patients WHERE id = $1', [patientId]);
    }
    await db.query('DELETE FROM users WHERE id = $1', [providerId]);
    await db.close();
  });

  describe('POST /api/v1/patients', () => {
    it('should create a patient with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/patients')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          name: 'Test Patient',
          age: 65,
          email: 'patient@test.com',
          phone: '+1234567890',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patient.name).toBe('Test Patient');
      patientId = response.body.data.patient.id;
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/patients')
        .send({
          name: 'Test Patient',
          age: 65,
        });

      expect(response.status).toBe(401);
    });

    it('should reject invalid patient data', async () => {
      const response = await request(app)
        .post('/api/v1/patients')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          name: 'A', // Too short
          age: 10, // Too young
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/patients', () => {
    it('should get list of patients', async () => {
      const response = await request(app)
        .get('/api/v1/patients')
        .set('Authorization', `Bearer ${providerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('patients');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should filter patients by risk level', async () => {
      const response = await request(app)
        .get('/api/v1/patients?risk_level=High')
        .set('Authorization', `Bearer ${providerToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/patients/:id', () => {
    it('should get patient by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/patients/${patientId}`)
        .set('Authorization', `Bearer ${providerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.patient.id).toBe(patientId);
    });

    it('should return 404 for non-existent patient', async () => {
      const response = await request(app)
        .get('/api/v1/patients/99999')
        .set('Authorization', `Bearer ${providerToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/patients/:id', () => {
    it('should update patient', async () => {
      const response = await request(app)
        .put(`/api/v1/patients/${patientId}`)
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          cognitive_score: 65,
          risk_level: 'Moderate',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.patient.cognitive_score).toBe(65);
    });
  });
});




