'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'virtual_account_provider', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      provider_name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      api_key: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      api_secret: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      basic_auth_username: {
        allowNull: true,
        type: Sequelize.STRING
      },
      basic_auth_password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      signature: {
        allowNull: true,
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'virtual_account_provider', schema });
  }
};