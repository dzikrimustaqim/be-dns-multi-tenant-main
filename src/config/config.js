// src/config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // logging: false,
    logging: console.log,
    // Opsi tambahan untuk mengaktifkan schema search path per tenant
    schema: process.env.SCHEMA || 'public',
    dialectOptions: {
      // Khusus PostgreSQL
      prependSearchPath: true
    },
    migrationStorageTableName: 'sequelize_meta_dev'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    schema: process.env.SCHEMA || 'public',
    dialectOptions: {
      prependSearchPath: true
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    schema: process.env.SCHEMA || 'public',
    dialectOptions: {
      prependSearchPath: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  notifications: {
    enabled: process.env.NOTIFICATIONS_ENABLED === 'true',
    emailConfig: {
      enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO
    },
    slackConfig: {
      enabled: process.env.SLACK_NOTIFICATIONS_ENABLED === 'true',
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: process.env.SLACK_CHANNEL
    }
  },
};
