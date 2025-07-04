'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'log_tagihan_siswa', schema }, {
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
      id_user: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      message: {
        type: Sequelize.TEXT
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

    await queryInterface.dropTable({ tableName: 'log_tagihan_siswa', schema });
  }
};