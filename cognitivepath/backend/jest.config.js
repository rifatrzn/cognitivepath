module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/migrations/',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/migrations/**',
    '!server.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};




