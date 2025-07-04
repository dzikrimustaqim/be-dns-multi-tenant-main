'use strict';

const Helper = require('../../utils/helper');

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

    await queryInterface.bulkInsert({ tableName: 'proguser', schema: schema }, [
      {
        role_id: 1,
        username: 'admin',
        password: Helper.hashPassword('admin'),
        email: 'meefta66@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});

    const users = await queryInterface.sequelize.query(
      `SELECT id from "${schema}"."proguser";`
    );

    const userRows = users[0];

    await queryInterface.bulkInsert({ tableName: 'staff_profile', schema: schema }, [
      {
        id_user: userRows[0].id,
        real_name: 'Super Administrator',
        gender: 'L',
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
    
    await queryInterface.bulkDelete({ tableName: 'staff_profile', schema: schema }, null, {});
    await queryInterface.bulkDelete({ tableName: 'proguser', schema: schema }, null, {});
  }
};
