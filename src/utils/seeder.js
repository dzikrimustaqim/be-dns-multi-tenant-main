const path = require('path');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const minimist = require('minimist');
const config = require('../config/config');

const args = minimist(process.argv.slice(2), {
  string: ['seed', 'tenant'],
  boolean: ['all'],
  alias: { s: 'seed', t: 'tenant' }
});

// Determine the environment (e.g., development, production)
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env]; // Get the configuration for the current environment

async function handleSeeders() {
  const schema = args.schema;
  const command = args._[0] || 'seed';
  const seedFile = args.seed;
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
      const umzug = createUmzugInstance(publicSequelize, 'seeders/public');
      await executeSeedCommand(umzug, command, seedFile);
    } else if (schema === 'tenant') {
      if (runAll) {
        const tenants = await getTenants(publicSequelize);
        for (const tenant of tenants) {
          await processTenantSeed(tenant.schema, command, seedFile);
        }
      } else {
        const tenantSchema = tenantArg || process.env.TENANT_SCHEMA;
        if (!tenantSchema) throw new Error('Tenant schema required');
        await processTenantSeed(tenantSchema, command, seedFile);
      }
    }
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await publicSequelize.close();
  }
}

async function processTenantSeed(schemaName, command, seedFile) {
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
    const umzug = createUmzugInstance(tenantSequelize, 'seeders/tenant');
    console.log(`Processing tenant: ${schemaName}`);
    await executeSeedCommand(umzug, command, seedFile);
  } finally {
    await tenantSequelize.close();
  }
}

function createUmzugInstance(sequelize, seedersPath) {
  // Ekstrak nama skema dari objek sequelize yang diberikan
  // Ini penting karena Anda ingin tabel migrasi dibuat di skema tenant yang sesuai
  const schemaForStorage = sequelize.options.dialectOptions.searchPath || 'public'; // Ambil searchPath atau default ke 'public'
  console.log('schemaForStorage', schemaForStorage);
  
  return new Umzug({
    migrations: {
      glob: path.join(__dirname, '../', seedersPath, '/*.js'),
      resolve: ({ name, path }) => {
        const seeder = require(path);
        return {
          name,
          up: async () => seeder.up(sequelize.getQueryInterface(), Sequelize),
          down: async () => seeder.down(sequelize.getQueryInterface(), Sequelize)
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

async function executeSeedCommand(umzug, command, seedFile) {
  switch (command) {
    case 'seed':
      if (seedFile) {
        const seederName = path.basename(seedFile, '.js');
        const migrations = (await umzug.pending()).filter(m => m.name === seederName);
        return umzug.up({ migrations });
      }
      return umzug.up();
    case 'seed:all':
      return umzug.up();
    case 'undo':
      if (seedFile) {
        const seederName = path.basename(seedFile, '.js');
        const migrations = (await umzug.executed()).filter(m => m.name === seederName);
        return umzug.down({ migrations });
      }
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

handleSeeders();