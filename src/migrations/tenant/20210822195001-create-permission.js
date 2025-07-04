'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable(
      { tableName: 'permission', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      module: {
        allowNull: false,
        type: Sequelize.STRING
      },
      permission_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slug: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
      { tableName: 'permission', schema },
      ['module', 'permission_name'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'permission', schema });
  }
};