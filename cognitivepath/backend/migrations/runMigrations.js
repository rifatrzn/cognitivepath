/**
 * Database Migration Runner
 * Runs SQL migration files in order
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const logger = require('../config/logger');

const migrationsDir = path.join(__dirname);

async function runMigrations() {
  try {
    // Connect to database
    await db.connect();

    // Get all migration files
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    logger.info(`Found ${files.length} migration file(s)`);

    // Run each migration
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      logger.info(`Running migration: ${file}`);
      
      try {
        await db.query(sql);
        logger.info(`Migration ${file} completed successfully`);
      } catch (error) {
        // Check if error is due to table already existing
        if (error.message.includes('already exists')) {
          logger.warn(`Migration ${file} skipped (already applied)`);
        } else {
          throw error;
        }
      }
    }

    logger.info('All migrations completed');
    await db.close();
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed', error);
    await db.close();
    process.exit(1);
  }
}

runMigrations();




