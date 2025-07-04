'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'biaya_khusus_item', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_biaya_khusus: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: 'biaya_khusus', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_item_biaya: {
        type: Sequelize.INTEGER,
        references: { model: 'item_biaya', key: 'id' },
        onDelete: 'NO ACTION'
      },
      jumlah: {
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
      { tableName: 'biaya_khusus_item', schema },
      ['id_biaya_khusus', 'id_item_biaya'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'biaya_khusus_item', schema });
  }
};