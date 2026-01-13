/**
 * Patient Model
 * Handles patient data
 */

const db = require('../config/database');
const logger = require('../config/logger');

class Patient {
  /**
   * Create a new patient
   */
  static async create(patientData) {
    const { name, age, email, phone, provider_id } = patientData;

    const query = `
      INSERT INTO patients (name, age, email, phone, provider_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, name, age, email, phone, provider_id, cognitive_score, risk_level, status, created_at
    `;

    try {
      const result = await db.query(query, [name, age, email, phone, provider_id]);
      logger.info('Patient created', { patientId: result.rows[0].id, name });
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating patient', error);
      throw error;
    }
  }

  /**
   * Find patient by ID
   */
  static async findById(id) {
    const query = `
      SELECT p.*, u.name as provider_name, u.email as provider_email
      FROM patients p
      LEFT JOIN users u ON p.provider_id = u.id
      WHERE p.id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find patients by provider ID
   */
  static async findByProvider(providerId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, name, age, email, phone, cognitive_score, risk_level, status, created_at, updated_at
      FROM patients
      WHERE provider_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await db.query(query, [providerId, limit, offset]);
    return result.rows;
  }

  /**
   * Update patient
   */
  static async update(id, updates) {
    const allowedFields = ['name', 'age', 'email', 'phone', 'cognitive_score', 'risk_level', 'status'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE patients
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Get all patients (with filters)
   */
  static async findAll(filters = {}, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM patients WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.risk_level) {
      query += ` AND risk_level = $${paramCount}`;
      params.push(filters.risk_level);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.provider_id) {
      query += ` AND provider_id = $${paramCount}`;
      params.push(filters.provider_id);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Count patients
   */
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM patients WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.risk_level) {
      query += ` AND risk_level = $${paramCount}`;
      params.push(filters.risk_level);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.provider_id) {
      query += ` AND provider_id = $${paramCount}`;
      params.push(filters.provider_id);
      paramCount++;
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Delete patient
   */
  static async delete(id) {
    const query = 'DELETE FROM patients WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = Patient;





