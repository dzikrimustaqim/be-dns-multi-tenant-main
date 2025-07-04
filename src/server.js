// src/server.js
require('dotenv').config();
const app = require('./app');
const { createConnection } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await createConnection();
    logger.info('Database connection has been established successfully.');
    
    // Run migrations for public schema only on startup
    // This ensures tenant table exists
    if (process.env.RUN_MIGRATIONS_ON_STARTUP === 'true') {
      logger.info('Running migrations for public schema...');
      const { execSync } = require('child_process');
      execSync('npm run db:migrate', { stdio: 'inherit' });
      
      // Optionally run migrations for all active tenants
      // Comment this out if you prefer to run tenant migrations separately
      if (process.env.RUN_TENANT_MIGRATIONS_ON_STARTUP === 'true') {
        logger.info('Running migrations for all tenant schemas...');
        execSync('npm run db:migrate:tenant:all', { stdio: 'inherit' });
      }
    }
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

startServer();