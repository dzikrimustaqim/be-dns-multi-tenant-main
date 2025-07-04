'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'periode_kamar', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_kamar: {
        type: Sequelize.INTEGER,
        references: { model: 'kamar', key: 'id' },
        onDelete: 'NO ACTION',
      },
      id_periode: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION',
      },
      kuota: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      id_musyrifah: {
        type: Sequelize.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'SET NULL'
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
      { tableName: 'periode_kamar', schema },
      ['id_kamar', 'id_periode'],
      {
        unique: true
      }
    );
    await queryInterface.addIndex(
      { tableName: 'periode_kamar', schema },
      ['id_periode']      
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'periode_kamar', schema });
  }
};