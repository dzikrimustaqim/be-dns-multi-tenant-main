const path = require('path');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const minimist = require('minimist');
const config = require('../config/config');
const logger = require('./logger');

const args = minimist(process.argv.slice(2), {
  string: ['tenant'],
  boolean: ['all'],
  alias: { t: 'tenant' }
});

// Determine the environment (e.g., development, production)
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env]; // Get the configuration for the current environment

async function handleMigrations() {
  const schema = args.schema;
  const command = args._[0] || 'migrate';
  const tenantArg = args.tenant;
  const runAll = args.all;

  const publicSequelize = new Sequelize({
    ...currentConfig, // Use the specific environment config
    schema: 'public',
    dialectOptions: {
      ...currentConfig.dialectOptions,
      prependSearchPath: true,
      searchPath: 'public',
    },
  });

  try {
    if (schema === 'public') {
      const umzug = createUmzugInstance(publicSequelize, 'migrations/public');
      await executeCommand(umzug, command);
    } else if (schema === 'tenant') {
      if (runAll) {
        const tenants = await getTenants(publicSequelize);
        for (const tenant of tenants) {
          await processTenant(publicSequelize, tenant.schema, command);
        }
      } else {
        const tenantSchema = tenantArg || process.env.TENANT_SCHEMA;
        if (!tenantSchema) throw new Error('Tenant schema required');
        await processTenant(publicSequelize, tenantSchema, command);
      }
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await publicSequelize.close();
  }
}

// NEW FUNCTION: Check and Create Schema
async function ensureSchemaExists(sequelizeInstance, schemaName) {
  try {
    // Check if schema exists
    const [results] = await sequelizeInstance.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${schemaName}';`
    );

    if (results.length === 0) {
      // Schema does not exist, create it
      logger.info(`Schema '${schemaName}' does not exist. Creating it...`);
      await sequelizeInstance.query(`CREATE SCHEMA "${schemaName}";`);
      logger.info(`Schema '${schemaName}' created successfully.`);
    } else {
      logger.info(`Schema '${schemaName}' already exists. Skipping creation.`);
    }
  } catch (error) {
    logger.error(`Error ensuring schema '${schemaName}' exists:`, error);
    throw error; // Re-throw to stop the process if schema creation fails
  }
}

async function processTenant(publicSequelizeForSchemaCreation, schemaName, command) {
  const tenantSequelize = new Sequelize({
    ...currentConfig, // Use the specific environment config
    schema: schemaName,
    dialectOptions: {
      ...currentConfig.dialectOptions,
      prependSearchPath: true,
      searchPath: schemaName,
    },
  });
  
  try {
    // STEP 1: Ensure the tenant schema exists for migrate before attempting to connect to it
    if (command === 'migrate') {
      await ensureSchemaExists(publicSequelizeForSchemaCreation, schemaName);
    }

    const umzug = createUmzugInstance(tenantSequelize, 'migrations/tenant');
    logger.info(`Processing tenant: ${schemaName}`);
    
    await executeCommand(umzug, command);
  } finally {
    await tenantSequelize.close();
  }
}

function createUmzugInstance(sequelize, migrationsPath) {  
  // Ekstrak nama skema dari objek sequelize yang diberikan
  // Ini penting karena Anda ingin tabel migrasi dibuat di skema tenant yang sesuai
  const schemaForStorage = sequelize.options.dialectOptions.searchPath || 'public'; // Ambil searchPath atau default ke 'public'

  return new Umzug({
    migrations: {
      glob: path.join(__dirname, '../', migrationsPath, '/*.js'),
      resolve: ({ name, path }) => {
        const migration = require(path);
        return {
          name,
          up: async () => migration.up(sequelize.getQueryInterface(), Sequelize),
          down: async () => migration.down(sequelize.getQueryInterface(), Sequelize)
        };
      }
    },
    // Pass the migrationStorageTableName from your config to SequelizeStorage
    storage: new SequelizeStorage({
      sequelize,
      tableName: currentConfig.migrationStorageTableName || 'SequelizeMeta', // Default to 'SequelizeMeta' if not specified
      schema: schemaForStorage // Ini yang memberi tahu Umzug di skema mana tabel harus dibuat/dicari
    }),
    logger: console
  });
}

async function executeCommand(umzug, command) {
  switch (command) {
    case 'migrate':
      return umzug.up();
    case 'status':
      const executed = await umzug.executed();
      const pending = await umzug.pending();
      console.table([...executed, ...pending].map(m => ({
        Name: m.name,
        Status: executed.some(e => e.name === m.name) ? 'Executed' : 'Pending'
      })));
      break;
    case 'undo':
      return umzug.down();
    case 'undo:all':
      return umzug.down({ to: 0 });
    default:
      throw new Error(`Invalid command: ${command}`);
  }
}

async function getTenants(sequelize) {
  const Tenant = sequelize.define('Tenant', {
    schema: Sequelize.STRING,
    name: Sequelize.STRING
  }, {
    tableName: 'tenants', // <--- ADD THIS LINE 
    schema: 'public' 
});
  
  return Tenant.findAll();
}

handleMigrations();