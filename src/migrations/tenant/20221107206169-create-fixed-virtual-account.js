'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'fixed_virtual_account', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_siswa: {
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_virtual_account_type: {
        type: Sequelize.UUID,
        references: { model: 'virtual_account_type', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_group_biaya: {
        type: Sequelize.INTEGER,
        references: { model: 'group_biaya', key: 'id' },
        onDelete: 'NO ACTION'
      },  
      nomor_va: {
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

    await queryInterface.dropTable({ tableName: 'fixed_virtual_account', schema });
  }
};