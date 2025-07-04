'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable(
      { tableName: 'siswa', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      registrant_id: {
        allowNull: true,
        unique: true,
        type: Sequelize.DataTypes.UUID
      },
      regnumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      regpos: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      no_induk: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      photo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      parent_id: {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        references: { model: 'parent', key: 'id' },
        onDelete: 'SET NULL'
      },
      role_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'role', key: 'id' },
        onDelete: 'SET NULL'
      },
      tingkat_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'tingkat', key: 'id' },
        onDelete: 'SET NULL'
      },
      reg_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      angkatan: {
        allowNull: true,
        type: Sequelize.STRING(9)
      },
      username: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      nisn: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      npsn: {
        type: Sequelize.STRING
      },
      nss: {
        type: Sequelize.STRING
      },
      no_ijazah: {
        type: Sequelize.STRING
      },
      tempat_ijazah: {
        type: Sequelize.STRING
      },
      tahun_lulus: {
        type: Sequelize.STRING
      },
      alamat_sekolah_asal: {
        type: Sequelize.STRING
      },
      nama_lengkap: {
        type: Sequelize.STRING
      },
      nama_panggilan: {
        type: Sequelize.STRING
      },
      nama_arab: {
        type: Sequelize.STRING
      },
      agama: {
        type: Sequelize.STRING
      },
      agama_ayah: {
        type: Sequelize.STRING
      },
      agama_ibu: {
        type: Sequelize.STRING
      },
      nik: {
        type: Sequelize.STRING
      },
      nik: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM("L","P")
      },
      pob: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      anak_ke: {
        type: Sequelize.INTEGER
      },
      jumlah_anak: {
        type: Sequelize.INTEGER
      },
      telepon: {
        type: Sequelize.STRING
      },
      handphone: {
        type: Sequelize.STRING
      },
      fax: {
        type: Sequelize.STRING
      },
      riwayat_penyakit: {
        type: Sequelize.STRING
      },
      kelainan_jasmani: {
        type: Sequelize.STRING
      },
      berat_badan: {
        type: Sequelize.STRING
      },
      tinggi_badan: {
        type: Sequelize.STRING
      },
      golongan_darah: {
        type: Sequelize.ENUM("A","B","AB","O")
      },
      hoby: {
        type: Sequelize.STRING
      },
      hoby_kesenian: {
        type: Sequelize.STRING
      },
      hoby_olahraga: {
        type: Sequelize.STRING
      },
      hoby_menggambar: {
        type: Sequelize.STRING
      },
      hoby_lain_lain: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      email_rumah: {
        type: Sequelize.STRING
      },
      saudara_kandung_aktif: {
        type: Sequelize.STRING
      },
      sumber_info_sekolah: {
        type: Sequelize.STRING
      },
      lembaga_tujuan: {
        type: Sequelize.INTEGER
      },
      kelas_tujuan: {
        type: Sequelize.INTEGER
      },
      ukuran_baju: {
        type: Sequelize.STRING(4)
      },
      asal_sekolah: {
        type: Sequelize.STRING
      },
      nama_sekolah_asal: {
        type: Sequelize.STRING
      },
      tanggal_lulus: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      pilihan_pesantren_kedua: {
        type: Sequelize.STRING
      },
      no_kk: {
        type: Sequelize.STRING
      },
      nama_ayah: {
        type: Sequelize.STRING
      },
      nama_ayah_arab: {
        type: Sequelize.STRING
      },
      nik_ayah: {
        type: Sequelize.STRING
      },
      status_ayah: {
        type: Sequelize.STRING
      },
      pob_ayah: {
        type: Sequelize.STRING
      },
      dob_ayah: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gelar_akademik_ayah: {
        type: Sequelize.STRING
      },
      status_hidup_ayah: {
        type: Sequelize.ENUM("HIDUP","MENINGGAL")
      },
      pendidikan_terkahir_ayah: {
        type: Sequelize.STRING
      },
      pekerjaan_ayah: {
        type: Sequelize.STRING
      },
      jabatan_ayah: {
        type: Sequelize.STRING
      },
      penghasilan_perbulan_ayah: {
        type: Sequelize.INTEGER
      },
      penghasilan_tidak_tetap_perbulan_ayah: {
        type: Sequelize.INTEGER
      },
      telp_ayah: {
        type: Sequelize.STRING
      },
      telp_ayah2: {
        type: Sequelize.STRING
      },
      telp_kantor_ayah: {
        type: Sequelize.STRING
      },
      hp_kantor_ayah: {
        type: Sequelize.STRING
      },
      fax_kantor_ayah: {
        type: Sequelize.STRING
      },
      email_ayah: {
        type: Sequelize.STRING
      },
      website_ayah: {
        type: Sequelize.STRING
      },
      alamat_ayah: {
        type: Sequelize.TEXT
      },
      nama_dan_alamat_tempat_kerja_ayah: {
        type: Sequelize.TEXT
      },
      nama_ibu: {
        type: Sequelize.STRING
      },
      nama_ibu_arab: {
        type: Sequelize.STRING
      },
      nik_ibu: {
        type: Sequelize.STRING
      },
      status_ibu: {
        type: Sequelize.STRING
      },
      pob_ibu: {
        type: Sequelize.STRING
      },
      dob_ibu: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gelar_akademik_ibu: {
        type: Sequelize.STRING
      },
      status_hidup_ibu: {
        type: Sequelize.ENUM("HIDUP","MENINGGAL")
      },
      pendidikan_terkahir_ibu: {
        type: Sequelize.STRING
      },
      pekerjaan_ibu: {
        type: Sequelize.STRING
      },
      jabatan_ibu: {
        type: Sequelize.STRING
      },
      penghasilan_perbulan_ibu: {
        type: Sequelize.INTEGER
      },
      penghasilan_tidak_tetap_perbulan_ibu: {
        type: Sequelize.INTEGER
      },
      telp_ibu: {
        type: Sequelize.STRING
      },
      telp_ibu2: {
        type: Sequelize.STRING
      },
      telp_kantor_ibu: {
        type: Sequelize.STRING
      },
      hp_kantor_ibu: {
        type: Sequelize.STRING
      },
      fax_kantor_ibu: {
        type: Sequelize.STRING
      },
      email_ibu: {
        type: Sequelize.STRING
      },
      website_ibu: {
        type: Sequelize.STRING
      },
      alamat_ibu: {
        type: Sequelize.TEXT
      },
      nama_dan_alamat_tempat_kerja_ibu: {
        type: Sequelize.TEXT
      },
      yang_menanggung_biaya: {
        type: Sequelize.ENUM("AYAH","IBU","LAINNYA")
      },
      status_keluarga: {
        type: Sequelize.STRING
      },
      nama_penanggung_biaya: {
        type: Sequelize.STRING
      },
      hubungan_keluarga_penanggung_biaya: {
        type: Sequelize.STRING
      },
      telepon_penanggung_biaya: {
        type: Sequelize.STRING
      },
      pekerjaan_penanggung_biaya: {
        type: Sequelize.STRING
      },
      alamat_penanggung_biaya: {
        type: Sequelize.TEXT
      },
      kewarganegaraan: {
        type: Sequelize.ENUM("WNI","WNA")
      },
      negara: {
        type: Sequelize.STRING
      },
      kewarganegaraan_suku_ayah: {
        type: Sequelize.STRING
      },
      kewarganegaraan_suku_ibu: {
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
      lokasi_ujian: {
        type: Sequelize.STRING
      },
      nama_darurat: {
        type: Sequelize.STRING
      },
      hubungan_keluarga_darurat: {
        type: Sequelize.STRING
      },
      telepon_darurat: {
        type: Sequelize.STRING
      },
      telepon_kantor_darurat: {
        type: Sequelize.STRING
      },
      kelebihan_anak: {
        type: Sequelize.TEXT
      },
      kekurangan_anak: {
        type: Sequelize.TEXT
      },
      kondisi_lingkungan: {
        type: Sequelize.TEXT
      },
      note_teman_dekat: {
        type: Sequelize.TEXT
      },
      nama_teman_dekat: {
        type: Sequelize.STRING
      },
      sekolah_teman_dekat: {
        type: Sequelize.STRING
      },
      alamat_teman_dekat: {
        type: Sequelize.STRING
      },
      telepon_teman_dekat: {
        type: Sequelize.STRING
      },
      hp_teman_dekat: {
        type: Sequelize.STRING
      },
      current_status: {
        allowNull: false,
        type: Sequelize.ENUM("REGISTRATION","REGISTRATION_FEE","FILL_REGISTRATION_DATA","DOCUMENT_VALIDATION","ENTRANCE_EXAMINATION","ENTRY_TUITION_FEE","INFORMATION","ACCEPTED"),
        defaultValue: 'REGISTRATION'
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("REG","ACTIVE","ALUMNI","MUTATION","DO","UNPAID_DU","ISYROF_TAFAWWUQ","ISYROF_SULUK","TAHFIDZ","BIMBEL","TAHWIL","OTHER"),
        defaultValue: 'REG'
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: 't'
      },
      daftar_ulang: {
        type: Sequelize.BOOLEAN,
        defaultValue: 'f'
      },
      admin_input: {
        type: Sequelize.BOOLEAN,
        defaultValue: 'f'
      },
      tanggal_ujian: {
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
    await queryInterface.addIndex(
      { tableName: 'siswa', schema },
      ['regpos', 'angkatan'],
      {
        unique: true
      }
    );
    await queryInterface.addIndex(
      { tableName: 'siswa', schema },
      ['regnumber', 'angkatan'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'siswa', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_gender";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_golongan_darah";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_status_hidup_ayah";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_status_hidup_ibu";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_current_status";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_status";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_yang_menanggung_biaya";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_siswa_kewarganegaraan";`
    );
  }
};