'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.sequelize.query(`CREATE SEQUENCE "${schema}"."noinduk_sequence"`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.sequelize.query(`DROP SEQUENCE IF EXISTS "${schema}"."noinduk_sequence"`)
  }
};
