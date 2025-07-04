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

    await queryInterface.bulkInsert({ tableName: 'jenis_bayar', schema: schema }, [
      {
        nama_bayar: 'Registrasi',
        kode_bayar: 'REGISTRASI',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_bayar: 'SPP',
        kode_bayar: 'SPP',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_bayar: 'Uang Pangkal',
        kode_bayar: 'PANGKAL',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_bayar: 'Uang Saku',
        kode_bayar: 'SAKU',
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
    
    await queryInterface.bulkDelete({ tableName: 'jenis_bayar', schema: schema }, null, {});
  }
};
