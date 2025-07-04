'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.sequelize.query(`CREATE SEQUENCE "${schema}"."tagihan_sequence"`)
  },

  async down (queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.sequelize.query(`DROP SEQUENCE IF EXISTS "${schema}"."tagihan_sequence"`)
  }
};
