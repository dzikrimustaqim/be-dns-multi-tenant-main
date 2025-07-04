'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.bulkInsert({ tableName: 'permission', schema: schema }, [
      {
        module: 'SISWA',
        permission_name: 'Administer Siswa Baru',
        slug: 'ADMINISTER_SISWA_BARU',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SISWA',
        permission_name: 'Administer Hasil Ujian PPSB',
        slug: 'ADMINISTER_HASIL_UJIAN_PPSB',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SISWA',
        permission_name: 'Administer Buku Induk',
        slug: 'ADMINISTER_BUKU_INDUK',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SISWA',
        permission_name: 'Administer Tahun Ajaran Aktif',
        slug: 'ADMINISTER_TAHUN_AJARAN_AKTIF',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Administer Penempatan Kelas',
        slug: 'ADMINISTER_PENEMPATAN_KELAS',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Administer Absensi Siswa',
        slug: 'ADMINISTER_ABSENSI_SISWA',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Administer Jadwal Mengajar',
        slug: 'ADMINISTER_JADWAL_MENGAJAR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Administer Izin Mengajar',
        slug: 'ADMINISTER_IZIN_MENGAJAR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Can Approve Izin Mengajar',
        slug: 'APPROVE_IZIN_MENGAJAR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Can Assign Guru Pengganti',
        slug: 'CAN_ASSIGN_GURU_PENGGANTI',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Can Add Izin Mengajar',
        slug: 'CAN_ADD_IZIN_MENGAJAR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Administer Classroom',
        slug: 'ADMINISTER_CLASSROOM',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Administer Input Nilai Harian/Bulanan',
        slug: 'ADMINISTER_INPUT_HARIAN_BULANAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENDIDIKAN',
        permission_name: 'Administer Raport',
        slug: 'ADMINISTER_RAPORT',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'KEUANGAN',
        permission_name: 'Administer Setup Biaya',
        slug: 'ADMINISTER_SETUP_BIAYA',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        module: 'SDM',
        permission_name: 'Administer List SDM',
        slug: 'ADMINSITER_LIST_SDM',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SDM',
        permission_name: 'Administer Catatan Guru',
        slug: 'ADMINISTER_CATATAN_GURU',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SDM',
        permission_name: 'Administer Wali Kelas',
        slug: 'ADMINISTER_WALI_KELAS',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SDM',
        permission_name: 'Administer Strukktur',
        slug: 'ADMINISTER_STRUKTUR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENGASUHAN',
        permission_name: 'Administer Kamar',
        slug: 'ADMINISTER_PENGASUHAN_KAMAR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENGASUHAN',
        permission_name: 'Administer Absen Kamar',
        slug: 'ADMINISTER_ABSEN_KAMAR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENGASUHAN',
        permission_name: 'Administer Izin Santri',
        slug: 'ADMINISTER_IZIN_SANTRI',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENGASUHAN',
        permission_name: 'Administer Pelanggaran',
        slug: 'ADMINISTER_PELANGGARAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'PENGASUHAN',
        permission_name: 'Administer Prestasi',
        slug: 'ADMINISTER_PRESTASI',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'MASTER',
        permission_name: 'Lembaga Ppendidikan',
        slug: 'ADMINISTER_LEMBAGA_PENDIDIKAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'MASTER',
        permission_name: 'Administer Tingkatan',
        slug: 'ADMINISTER_TINGAKATAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'MASTER',
        permission_name: 'Administer Kelas',
        slug: 'ADMINISTER_KELAS',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'MASTER',
        permission_name: 'Administer Pelajaran',
        slug: 'ADMINISTER_PELAJARAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'MASTER',
        permission_name: 'Administer Gedung',
        slug: 'ADMINISTER_GEDUNG',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'MASTER',
        permission_name: 'Administer Rayon',
        slug: 'ADMINISTER_RAYON',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'MASTER',
        permission_name: 'Administer Kamar',
        slug: 'ADMINISTER_MASTER_KAMAR',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'BRT',
        permission_name: 'Administer BRT',
        slug: 'ADMINISTER_BRT',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'ABSENSI',
        permission_name: 'Administer Absen Kegiatan',
        slug: 'ADMINISTER_ABSEN_KEGIATAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'ABSENSI',
        permission_name: 'View Laporan Absensi',
        slug: 'VIEW_LAPORAN_ABSENSI',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'ABSENSI',
        permission_name: 'View Monitoring Absensi',
        slug: 'VIEW_MONITORING_ABSENSI',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'NEWS',
        permission_name: 'Administer News',
        slug: 'ADMINISTER_NEWS',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },      
      {
        module: 'TASKS',
        permission_name: 'Administer Tugas Harian/Mingguan',
        slug: 'ADMINISTER_TUGAS_HARIAN_MINGGUAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SYSTEM SETTINGS',
        permission_name: 'Administer Tahun Ajaran',
        slug: 'ADMINISTER_SETTING_TAHUN_AJARAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SYSTEM SETTINGS',
        permission_name: 'Administer Pendaftaran',
        slug: 'ADMINISTER_SETTING_PENDAFTARAN',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SYSTEM SETTINGS',
        permission_name: 'Administer Role Permissions',
        slug: 'ADMINISTER_SETTING_ROLE_PERMISSION',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        module: 'SYSTEM SETTINGS',
        permission_name: 'Administer Setting Insya/Daily',
        slug: 'ADMINISTER_SETTING_INSYA_DAILY',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.bulkDelete({ tableName: 'permission', schema: schema }, null, {});
  }
};
