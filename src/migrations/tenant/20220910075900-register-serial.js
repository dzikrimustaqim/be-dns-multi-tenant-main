'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.sequelize.query(`CREATE SEQUENCE "${schema}"."registration_sequence"`)
  },

  async down (queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.sequelize.query(`DROP SEQUENCE IF EXISTS "${schema}"."registration_sequence"`)
  }
};
