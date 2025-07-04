// src/migrations/public/20230101000000-create-tenant.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tenants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      schema: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      plan: {
        type: Sequelize.ENUM('free', 'basic', 'premium'),
        defaultValue: 'free'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
      },
      migrationStatus: {
        type: Sequelize.ENUM('up_to_date', 'pending', 'in_progress', 'failed', 'warning'),
        defaultValue: 'pending',
        field: 'migration_status'
      },
      lastMigration: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'last_migration'
      },
      currentVersion: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Versi migrasi terakhir yang berhasil',
        field: 'current_version'
      },
      settings: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      schema: 'public'
    });
    
    // Indeks untuk pencarian tenant berdasarkan domain
    await queryInterface.addIndex('tenants', ['domain'], {
      schema: 'public'
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tenants', { schema: 'public' });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "public"."enum_tenants_plan";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "public"."enum_tenants_migrationStatus";');
  }
};