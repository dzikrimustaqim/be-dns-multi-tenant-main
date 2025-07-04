'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'catatan_siswa', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      absensi_id: {
        allowNull: true,
        unique: true,
        type: Sequelize.UUID,
        references: { model: 'absensi_harian_siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      siswa_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      guru_id: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      catatan_positif: {
        type: Sequelize.TEXT
      },
      catatan_negatif: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'catatan_siswa', schema });
  }
};