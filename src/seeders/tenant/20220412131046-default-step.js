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
    
    await queryInterface.bulkInsert({ tableName: 'registration_step', schema: schema }, [
      {
        slug: 'REGISTRATION_FEE',
        step_name: 'Bayar Pendaftaran',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'FILL_REGISTRATION_DATA',
        step_name: 'Isi Data Pendaftaran',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'DOCUMENT_VALIDATION',
        step_name: 'Validasi Dokumen',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'ENTRANCE_EXAMINATION',
        step_name: 'Ujian Masuk',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'ENTRY_TUITION_FEE',
        step_name: 'Bayar Uang Pangkal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'INFORMATION',
        step_name: 'Informasi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'ACCEPTED',
        step_name: 'Diterima',
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
    
    await queryInterface.bulkDelete({ tableName: 'registration_step', schema: schema }, null, {});
  }
};
