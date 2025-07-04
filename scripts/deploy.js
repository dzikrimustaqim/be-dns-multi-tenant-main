// scripts/deploy.js
require('dotenv').config();
const { execSync } = require('child_process');
const logger = require('../src/utils/logger');

async function deploy() {
  try {
    logger.info('Starting deployment process');
    
    // 1. Migrate public schema
    logger.info('Running migrations for public schema');
    execSync('npm run migrate:public', { stdio: 'inherit' });
    
    // 2. Migrate all tenant schemas
    logger.info('Running migrations for all tenant schemas');
    execSync('node src/utils/runMigrations.js', { stdio: 'inherit' });
    
    // 3. Seed data if needed (only in development or staging)
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Running seeders');
      
      // Seed public schema
      execSync('npm run seed:public', { stdio: 'inherit' });
      
      // Seed all tenant schemas
      execSync('node src/utils/runSeeders.js', { stdio: 'inherit' });
    }
    
    logger.info('Deployment process completed successfully');
  } catch (error) {
    logger.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();