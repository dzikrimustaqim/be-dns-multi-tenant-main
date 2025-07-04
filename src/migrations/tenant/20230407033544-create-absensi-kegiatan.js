'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'absensi_kegiatan', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      periode_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      jenis_absen_id: {
        type: Sequelize.INTEGER,
        references: { model: 'jenis_absen', key: 'id' },
        onDelete: 'NO ACTION'
      },
      absensi_kelompok_id: {
        type: Sequelize.INTEGER,
        references: { model: 'absensi_kelompok', key: 'id' },
        onDelete: 'NO ACTION'
      },
      keterangan: {
        type: Sequelize.TEXT
      },
      proguser_id: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
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

    await queryInterface.dropTable({ tableName: 'absensi_kegiatan', schema });
  }
};