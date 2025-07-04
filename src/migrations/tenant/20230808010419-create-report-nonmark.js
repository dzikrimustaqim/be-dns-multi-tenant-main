'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'report_nonmark', schema }, {
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
      id_siswa: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      alpha: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      sakit: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      izin_pribadi: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      izin_tugas: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      keseriusan: {
        type: Sequelize.STRING
      },
      kesehatan: {
        type: Sequelize.STRING
      },
      ketekunan: {
        type: Sequelize.STRING
      },
      perilaku: {
        type: Sequelize.NUMERIC(5,2)
      },
      kebersihan: {
        type: Sequelize.NUMERIC(5,2)
      },
      kehadiran: {
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
      { tableName: 'report_nonmark', schema },
      ['id_tahun_ajaran','semester','id_siswa'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'report_nonmark', schema });
  }
};