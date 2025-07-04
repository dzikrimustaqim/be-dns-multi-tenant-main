'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable(
      { tableName: 'studi', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_studi: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      nama_studi: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      nama_studi_en: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      nama_studi_ar: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      relasi_nilai: {
        allowNull: false,
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_nilai_harian: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_nilai_mid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_nilai_semester: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tipe_kalkulasi: {
        type: Sequelize.INTEGER,
        defaultValue: 1
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

    await queryInterface.dropTable({ tableName: 'studi', schema });
  }
};