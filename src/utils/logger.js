// src/utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Pastikan direktori log ada
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Konfigurasi format logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Tentukan level log berdasarkan environment
const level = process.env.LOG_LEVEL || 
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Buat logger
const logger = winston.createLogger({
  level,
  format: logFormat,
  defaultMeta: { service: 'multi-tenant-api' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Jika bukan di production, log juga ke console dengan format yang lebih bagus
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      let metaStr = '';
      if (Object.keys(meta).length) {
        try {
          metaStr = util.inspect(meta, { depth: null, colors: false });
        } catch (e) {
          metaStr = '[Cannot display meta]';
        }
      }
      return `${timestamp} ${level}: ${message} ${metaStr}`;
    })
  ),
}));

}

// Middleware untuk logging HTTP requests
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;