'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'student_mark', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_tahun_ajaran: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      semester: {
        allowNull: false,
        type: `"${schema}"."semester_enum"`
      },
      tipe: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_studi: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'studi', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_siswa: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      markvalue: {
        type: Sequelize.NUMERIC(5,2)
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
      { tableName: 'student_mark', schema },
      ['id_tahun_ajaran','semester','tipe','id_studi','id_siswa'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'student_mark', schema });
  }
};