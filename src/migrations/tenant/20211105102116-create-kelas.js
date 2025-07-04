'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable(
      { tableName: 'kelas', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_tingkat: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'tingkat', key: 'id' },
        onDelete: 'NO ACTION',
      },
      kode_kelas: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      nama_kelas: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nama_kelas_ar: {
        allowNull: false,
        type: Sequelize.STRING
      },
      jurusan: {
        allowNull: true,
        type: Sequelize.STRING
      },
      urut: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
      { tableName: 'kelas', schema },
      ['id_tingkat', 'nama_kelas'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'kelas', schema });
  }
};