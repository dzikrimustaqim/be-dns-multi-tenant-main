'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'absensi_kamar', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_tahun_ajaran: {
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_kamar: {
        type: Sequelize.INTEGER,
        references: { model: 'kamar', key: 'id' },
        onDelete: 'NO ACTION',
      },
      guru_penginput_id: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_replacement: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      total_siswa: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      jumlah_siswa_aktif: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      availability: {
        type: Sequelize.ENUM("Y","N"),
        defaultValue: 'Y'
      },
      reason: {
        type: Sequelize.STRING
      },
      total_h: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_a: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_s: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_ip: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_it: {
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
      { tableName: 'absensi_kamar', schema },
      ['id_tahun_ajaran', 'id_kamar', 'tanggal'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'absensi_kamar', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_absensi_kamar_availability";`
    );
  }
};