'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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

    await queryInterface.bulkInsert({ tableName: 'lokasi_ujian', schema: schema }, [
      {
        nama_lokasi: 'DARUNNAJAH JAKARTA SELATAN',
        urut: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'AMBON',
        urut: 2,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'ACEH',
        urut: 3,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'BATAM, KEPULAUAN RIAU',
        urut: 4,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'BENGKULU',
        urut: 5,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'GORONTALO',
        urut: 6,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'JAMBI KOTA, JAMBI',
        urut: 7,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'KALIMANTAN TIMUR',
        urut: 8,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'MAKASAR, SULAWESI SELATAN',
        urut: 9,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'MANADO, SULAWESI UTARA',
        urut: 10,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'PEKANBARU RIAU',
        urut: 11,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'DUMAI RIAU',
        urut: 12,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'BANJARMASIN, KALIMANTAN SELATAN',
        urut: 13,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'PONTIANAK, KALIMANTAN BARAT',
        urut: 14,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'PALANGKARAYA, KALIMANTAN TENGAH',
        urut: 15,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'TERNATE, MALUKU UTARA',
        urut: 16,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_lokasi: 'PALEMBANG, SUMATRA SELATAN',
        urut: 17,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.bulkDelete({ tableName: 'lokasi_ujian', schema: schema }, null, {});
  }
};
