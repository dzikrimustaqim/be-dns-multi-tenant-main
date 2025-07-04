'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'va_fixed_close_request', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_provider: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: 'virtual_account_provider', key: 'id' },
        onDelete: 'NO ACTION'
      },
      prefix: {
        allowNull: false,
        type: Sequelize.STRING
      },
      requested_amount: {
        type: Sequelize.NUMERIC(10,2),
        defaultValue: 0
      },
      virtual_account_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transaction_ref: {
        allowNull: false,
        type: Sequelize.STRING
      },
      virtual_account_expiry: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      request_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      va_status: {
        type: Sequelize.ENUM("CREATE","UPDATE","DELETE","INQUIRY","ON_PROCESS","AKTIVE","NONAKTIVE","ERROR")
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

    await queryInterface.dropTable({ tableName: 'va_fixed_close_request', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_va_fixed_close_request_va_status";`
    );
  }
};