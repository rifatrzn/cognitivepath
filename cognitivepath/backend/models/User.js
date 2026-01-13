/**
 * User Model
 * Handles user data and authentication
 */

const db = require('../config/database');
const bcrypt = require('bcrypt');
const config = require('../config');
const logger = require('../config/logger');

class User {
  /**
   * Create a new user
   */
  static async create(userData) {
    const { email, password, name, role = 'patient' } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

    const query = `
      INSERT INTO users (email, password_hash, name, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, email, name, role, is_active, created_at
    `;

    try {
      const result = await db.query(query, [email, hashedPassword, name, role]);
      logger.info('User created', { userId: result.rows[0].id, email });
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email already exists');
      }
      logger.error('Error creating user', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, email, password_hash, name, role, is_active, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = `
      SELECT id, email, password_hash, name, role, is_active, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Verify password
   */
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  /**
   * Update user
   */
  static async update(id, updates) {
    const allowedFields = ['name', 'role', 'is_active'];
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
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, role, is_active, created_at, updated_at
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update password
   */
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, name, role
    `;

    const result = await db.query(query, [hashedPassword, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete user (soft delete)
   */
  static async delete(id) {
    const query = `
      UPDATE users
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get all users (with pagination)
   */
  static async findAll(page = 1, limit = 10, role = null) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT id, email, name, role, is_active, created_at, updated_at
      FROM users
    `;
    const params = [];
    let paramCount = 1;

    if (role) {
      query += ` WHERE role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Count users
   */
  static async count(role = null) {
    let query = 'SELECT COUNT(*) as count FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = User;





