'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'data_absensi_kegiatan', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      absensi_kegiatan_id: {
        type: Sequelize.UUID,
        references: { model: 'absensi_kegiatan', key: 'id' },
        onDelete: 'NO ACTION'
      },
      siswa_id: {
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      h: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      a: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      s: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ip: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      it: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    
    await queryInterface.addIndex(
      { tableName: 'data_absensi_kegiatan', schema },
      ['absensi_kegiatan_id', 'siswa_id'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'data_absensi_kegiatan', schema });
  }
};