'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'izin_santri', schema }, {
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
      id_periode: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION',
      },
      id_kelas: {
        type: Sequelize.INTEGER,
        references: { model: 'kelas', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_kamar: {
        type: Sequelize.INTEGER,
        references: { model: 'kamar', key: 'id' },
        onDelete: 'NO ACTION',
      },
      tujuan: {
        type: Sequelize.ENUM("RUMAH","SEKITAR","TUGAS PONDOK","KAMAR","LAIN-LAIN")
      },
      keperluan: {
        type: Sequelize.STRING
      },
      tgl_jam_berangkat: {
        type: Sequelize.DATE
      },
      tgl_jam_kembali: {
        type: Sequelize.DATE
      },
      tanda_tangan_title: {
        type: Sequelize.ENUM("Bagian Pengasuhan","Bagian Keamanan","Kepala Pengasuhan","Pimpinan Pondok")
      },
      nama_penjemput: {
        type: Sequelize.STRING
      },
      hubungan_penjemput: {
        type: Sequelize.STRING
      },
      lapor_kembali: {
        type: Sequelize.ENUM("Ya","Tidak")
      },
      id_penginput: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
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
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'izin_santri', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_izin_santri_tujuan";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_izin_santri_tanda_tangan_title";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_izin_santri_lapor_kembali";`
    );
  }
};