'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'staff_profile', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_user: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'CASCADE'
      },
      nik: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      real_name: {
        type: Sequelize.STRING
      },
      name_ar: {
        type: Sequelize.STRING
      },
      gelar_akademik: {
        type: Sequelize.STRING
      },
      pob: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM("L","P")
      },
      hobby: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      sign: {
        type: Sequelize.STRING
      },
      marital_status: {
        type: Sequelize.ENUM("NOT_MARRIED","MARRIED")
      },
      facebook: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      no_hp1: {
        type: Sequelize.STRING
      },
      no_hp2: {
        type: Sequelize.STRING
      },
      golongan_darah: {
        type: Sequelize.ENUM("A","B","AB","O")
      },
      ayah: {
        type: Sequelize.STRING
      },
      ibu: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.TEXT
      },
      rt: {
        type: Sequelize.STRING
      },
      rw: {
        type: Sequelize.STRING
      },
      provinsi: {
        type: Sequelize.STRING
      },
      kodepos: {
        type: Sequelize.STRING
      },
      kota_kab: {
        type: Sequelize.STRING
      },
      kecamatan: {
        type: Sequelize.STRING
      },
      desa_kelurahan: {
        type: Sequelize.STRING
      },
      kode_guru_nip: {
        type: Sequelize.STRING
      },
      nuptk: {
        type: Sequelize.STRING
      },
      kode_guru_nip: {
        type: Sequelize.STRING
      },
      kode_guru_nip: {
        type: Sequelize.STRING
      },
      kode_guru_nip: {
        type: Sequelize.STRING
      },
      aktifitas_luar_pondok: {
        type: Sequelize.TEXT
      },
      rekomendasi: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM("AKTIF","NON_AKTIF","CUTI"),
        defaultValue: 'AKTIF'
      },
      tahun_bertugas: {
        type: Sequelize.STRING
      },
      tanggal_masuk: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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

    await queryInterface.dropTable({ tableName: 'staff_profile', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_staff_profile_gender";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_staff_profile_marital_status";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_staff_profile_golongan_darah";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_staff_profile_status";`
    );
  }
};