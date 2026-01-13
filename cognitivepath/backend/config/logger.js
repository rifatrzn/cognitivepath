/**
 * Logger Configuration
 * Centralized logging system with different log levels
 */

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || 'info';
    this.logFile = path.join(logsDir, process.env.LOG_FILE || 'app.log');
  }

  /**
   * Check if log level should be logged
   */
  shouldLog(level) {
    return logLevels[level] <= logLevels[this.level];
  }

  /**
   * Format log message
   */
  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const dataStr = Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}\n`;
  }

  /**
   * Write to log file
   */
  writeToFile(message) {
    fs.appendFileSync(this.logFile, message, 'utf8');
  }

  /**
   * Log error
   */
  error(message, error = {}) {
    if (this.shouldLog('error')) {
      const logMessage = this.formatMessage('error', message, {
        error: error.message || error,
        stack: error.stack,
      });
      console.error(`\x1b[31m${logMessage.trim()}\x1b[0m`); // Red color
      this.writeToFile(logMessage);
    }
  }

  /**
   * Log warning
   */
  warn(message, data = {}) {
    if (this.shouldLog('warn')) {
      const logMessage = this.formatMessage('warn', message, data);
      console.warn(`\x1b[33m${logMessage.trim()}\x1b[0m`); // Yellow color
      this.writeToFile(logMessage);
    }
  }

  /**
   * Log info
   */
  info(message, data = {}) {
    if (this.shouldLog('info')) {
      const logMessage = this.formatMessage('info', message, data);
      console.log(`\x1b[36m${logMessage.trim()}\x1b[0m`); // Cyan color
      this.writeToFile(logMessage);
    }
  }

  /**
   * Log debug
   */
  debug(message, data = {}) {
    if (this.shouldLog('debug')) {
      const logMessage = this.formatMessage('debug', message, data);
      console.log(`\x1b[90m${logMessage.trim()}\x1b[0m`); // Gray color
      this.writeToFile(logMessage);
    }
  }
}

module.exports = new Logger();





