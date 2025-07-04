'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'nilai_daily_composition_siswa', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      nilai_daily_composition_id: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'nilai_daily_composition', key: 'id' },
        onDelete: 'NO ACTION'
      },
      siswa_id: {
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      nilai: {
        type: Sequelize.NUMERIC(5,2)
      },
      keterangan: {
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

    await queryInterface.addIndex(
      { tableName: 'nilai_daily_composition_siswa', schema },
      ['nilai_daily_composition_id', 'siswa_id'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'nilai_daily_composition_siswa', schema });
  }
};