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

    await queryInterface.bulkInsert({ tableName: 'chart_type', schema: schema }, [
      {
        type_id: 10,
        name: 'Kas Bank',
        class_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 12,
        name: 'Piutang Usaha',
        class_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 13,
        name: 'Aktiva Tetap',
        class_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 14,
        name: 'Inventaris',
        class_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 15,
        name: 'Aktiva Lain',
        class_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 20,
        name: 'Utang Usaha',
        class_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 22,
        name: 'Kewajiban',
        class_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 30,
        name: 'Modal',
        class_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 40,
        name: 'Pendapatan',
        class_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 50,
        name: 'Harga Pokok Penjualan',
        class_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 60,
        name: 'Beban',
        class_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 70,
        name: 'Pendapatan Lain',
        class_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type_id: 80,
        name: 'Beban Lain-Lain',
        class_id: 4,
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
    
    await queryInterface.bulkDelete({ tableName: 'chart_type', schema: schema }, null, {});
  }
};
