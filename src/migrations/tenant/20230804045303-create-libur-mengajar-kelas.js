'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'libur_mengajar_kelas', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_libur_mengajar: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        references: { model: 'libur_mengajar', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_kelas: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'kelas', key: 'id' },
        onDelete: 'NO ACTION'
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
      { tableName: 'libur_mengajar_kelas', schema },
      ['id_libur_mengajar', 'id_kelas'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'libur_mengajar_kelas', schema });
  }
};