// src/models/tenant.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define('Tenant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    schema: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9_]+$/i, // Hanya alphanumeric dan underscore yang diperbolehkan untuk nama schema
        notIn: [['public', 'information_schema']] // Nama schema yang dicadangkan
      }
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    plan: {
      type: DataTypes.ENUM('free', 'basic', 'premium'),
      defaultValue: 'free'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    migrationStatus: {
      type: DataTypes.ENUM('up_to_date', 'pending', 'in_progress', 'failed', 'warning'),
      defaultValue: 'pending',
      field: 'migration_status'
    },
    lastMigration: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_migration'
    },
    currentVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Versi migrasi terakhir yang berhasil',
      field: 'current_version'
    }
  }, {
    tableName: 'tenants',
    timestamps: true,
    paranoid: true, // Soft deletes
    schema: 'public' // Memastikan model ini selalu menggunakan schema public
  });

  return Tenant;
};