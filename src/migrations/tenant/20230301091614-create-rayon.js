'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'rayon', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_gedung: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'gedung', key: 'id' },
        onDelete: 'NO ACTION',
      },
      nama_rayon: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      id_murobbi: {
        type: Sequelize.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'SET NULL'
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
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'rayon', schema });
  }
};