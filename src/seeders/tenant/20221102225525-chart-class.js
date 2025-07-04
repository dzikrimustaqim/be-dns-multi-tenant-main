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

    await queryInterface.bulkInsert({ tableName: 'chart_class', schema: schema }, [
      {
        class_name: 'HARTA',
        ctype: 'CL_ASSETS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        class_name: 'KEWAJIBAN',
        ctype: 'CL_LIABILITIES',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        class_name: 'PENDAPATAN',
        ctype: 'CL_INCOME',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        class_name: 'BIAYA',
        ctype: 'CL_EXPENSE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        class_name: 'EKUITAS',
        ctype: 'CL_EQUITY',
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
    
    await queryInterface.bulkDelete({ tableName: 'chart_class', schema: schema }, null, {});
  }
};
