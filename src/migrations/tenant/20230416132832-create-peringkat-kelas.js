'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'peringkat_kelas', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      siswa_kelas_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'siswakelas', key: 'id' },
        onDelete: 'NO ACTION'
      },
      semester: {
        type: `"${schema}"."semester_enum"`
      },
      sequence: {
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
      { tableName: 'peringkat_kelas', schema },
      ['siswa_kelas_id', 'semester'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'peringkat_kelas', schema });
  }
};