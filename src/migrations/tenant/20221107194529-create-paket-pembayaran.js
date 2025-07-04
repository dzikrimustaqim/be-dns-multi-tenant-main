'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'paket_pembayaran', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_paket: {
        allowNull: false,
        unique: false,
        type: Sequelize.STRING(100)
      },
      id_lembaga: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'lembaga', key: 'id' },
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
    
    await queryInterface.addIndex(
      { tableName: 'paket_pembayaran', schema },
      ['nama_paket', 'id_lembaga'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'paket_pembayaran', schema });
  }
};