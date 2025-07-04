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

    await queryInterface.bulkInsert({ tableName: 'item_biaya', schema: schema }, [
      {
        item_name: 'Registrasi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        item_name: 'Uang Pendidikan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        item_name: 'Uang Makan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        item_name: 'Infaq',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        item_name: 'Uang Lemari',
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
    
    await queryInterface.bulkDelete({ tableName: 'item_biaya', schema: schema }, null, {});
  }
};
