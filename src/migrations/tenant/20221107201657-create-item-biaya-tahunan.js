'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'item_biaya_tahunan', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_biaya_tahunan: {
        type: Sequelize.INTEGER,
        references: { model: 'biaya_tahunan', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_group_biaya: {
        type: Sequelize.INTEGER,
        references: { model: 'group_biaya', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_item_biaya: {
        type: Sequelize.INTEGER,
        references: { model: 'item_biaya', key: 'id' },
        onDelete: 'NO ACTION'
      },
      nilai_biaya: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER
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
      { tableName: 'item_biaya_tahunan', schema },
      ['id_biaya_tahunan', 'id_group_biaya', 'id_item_biaya'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'item_biaya_tahunan', schema });
  }
};