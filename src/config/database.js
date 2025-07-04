// src/config/database.js
const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('../utils/logger');

// Fungsi untuk membuat koneksi database berdasarkan environment dan schema
const createConnection = (schema = 'public') => {
  const env = process.env.NODE_ENV || 'development';
  const dbConfig = config[env];
  
  // Override schema jika disediakan
  if (schema) {
    dbConfig.schema = schema;
  }
  
  logger.info(`Creating database connection for environment: ${env}, schema: ${dbConfig.schema}`);
  
  const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      pool: dbConfig.pool,
      schema: dbConfig.schema,
      dialectOptions: dbConfig.dialectOptions
    }
  );
  
  return sequelize;
};

// Koneksi database default (public schema)
const sequelize = createConnection();

// Export fungsi untuk membuat koneksi dan koneksi default
module.exports = {
  sequelize,
  createConnection,
  config
};