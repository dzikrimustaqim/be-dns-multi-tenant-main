'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.createTable({ tableName: 'chart_master', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_code: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(15)
      },
      account_code2: {
        type: Sequelize.STRING(15)
      },
      account_name: {
        type: Sequelize.STRING(60)
      },
      account_type: {
        type: Sequelize.INTEGER,
        references: { model: 'chart_type', key: 'type_id' },
        onDelete: 'NO ACTION'
      },
      inactive: {
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
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'chart_master', schema });
  }
};