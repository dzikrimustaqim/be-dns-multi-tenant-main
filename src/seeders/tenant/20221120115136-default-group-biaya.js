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
    
    await queryInterface.bulkInsert({ tableName: 'group_biaya', schema: schema }, [
      {
        name: 'BIAYA PENDAFTARAN',
        kode: 'BIAYA_PENDAFTARAN',
        id_akun: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'IURAN BULANAN',
        kode: 'IURAN_BULANAN',
        id_akun: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'DAFTAR ULANG',
        kode: 'DAFTAR_ULANG',
        id_akun: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'UANG PANGKAL / WAKAF',
        kode: 'UANG_PANGKAL_WAKAF',
        id_akun: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bimbel 5 Bulan',
        kode: 'BIMBEL_5_BULAN',
        id_akun: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bimbel 10 Bulan',
        id_akun: 23,
        kode: 'BIMBEL_10_BULAN',
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
    
    await queryInterface.bulkDelete({ tableName: 'group_biaya', schema: schema }, null, {});
  }
};
