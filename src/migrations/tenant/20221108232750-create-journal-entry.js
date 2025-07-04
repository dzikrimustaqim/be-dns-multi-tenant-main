'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'journal_entries', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      created_by: {
        type: Sequelize.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      updated_by: {
        type: Sequelize.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      debit_chart_id: {
        type: Sequelize.INTEGER,
        references: { model: 'chart_master', key: 'id' },
        onDelete: 'NO ACTION'
      },
      credit_chart_id: {
        type: Sequelize.INTEGER,
        references: { model: 'chart_master', key: 'id' },
        onDelete: 'NO ACTION'
      },
      debit_amount: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      credit_amout: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      invoice_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: 'tagihan', key: 'id' },
        onDelete: 'NO ACTION'
      },
      receipt_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: 'pembayaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      type: {
        type: Sequelize.STRING(40)
      },
      description: {
        type: Sequelize.STRING
      },
      is_closed: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
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

    await queryInterface.dropTable({ tableName: 'journal_entries', schema });
  }
};