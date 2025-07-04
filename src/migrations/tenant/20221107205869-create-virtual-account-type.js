'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'virtual_account_type', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_virtual_account_provider: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: 'virtual_account_provider', key: 'id' },
        onDelete: 'NO ACTION'
      },
      prefix: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      va_type: {
        allowNull: false,
        type: Sequelize.ENUM('NON_FIXED','FIXED_CLOSE','FIXED_OPEN')
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

    await queryInterface.dropTable({ tableName: 'virtual_account_type', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_virtual_account_type_va_type";`
    );
  }
};