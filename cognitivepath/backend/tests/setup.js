/**
 * Test Setup
 * Configuration for Jest tests
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DB_NAME = 'cognitivepath_test';
process.env.DB_PASSWORD = 'test_password';

// Increase timeout for database operations
jest.setTimeout(30000);




