// scripts/test-migrations.js
const { execSync } = require('child_process');

async function testMigrations() {
  try {
    // 1. Run migrations
    console.log('Running migrations...');
    execSync('npm run migrate:all', { stdio: 'inherit' });
    
    // 2. Test rollback single step
    console.log('Testing rollback single step...');
    execSync('npm run migrate:rollback', { stdio: 'inherit' });
    
    // 3. Run migration again
    console.log('Running migrations again...');
    execSync('npm run migrate:all', { stdio: 'inherit' });
    
    // 4. Test rollback all
    console.log('Testing rollback all...');
    execSync('npm run migrate:rollback:all', { stdio: 'inherit' });
    
    console.log('Migration tests completed successfully!');
  } catch (error) {
    console.error('Migration tests failed:', error);
    process.exit(1);
  }
}

testMigrations();