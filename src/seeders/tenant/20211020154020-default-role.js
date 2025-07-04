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

    await queryInterface.bulkInsert({ tableName: 'role', schema: schema }, [
      {
        role_name: 'Super Admin',
        slug: 'SUPER_ADMIN',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'Admin',
        slug: 'ADMIN',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'Siswa',
        slug: 'SISWA',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'Parent',
        slug: 'PARENT',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'Walikelas',
        slug: 'WALIKELAS',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'Guru',
        slug: 'GURU',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'Kepala Sekolah',
        slug: 'KEPALA_SEKOLAH',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'Pengawas Madrasah',
        slug: 'PENGAWAS_MADRASAH',
        editable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
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

    await queryInterface.bulkDelete({ tableName: 'role', schema: schema }, null, {});
  }
};
