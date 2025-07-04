'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable(
      { tableName: 'tingkat', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_lembaga: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'lembaga', key: 'id' },
        onDelete: 'NO ACTION',
      },
      nama_tingkat: {
        type: Sequelize.STRING(80)
      },
      urut: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      ppsb: {
        type: Sequelize.BOOLEAN,
        defaultValue: 't'
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
      { tableName: 'tingkat', schema },
      ['id_lembaga', 'nama_tingkat'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'tingkat', schema });
  }
};