'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.addColumn({ tableName: 'berkas', schema }, 'mandatory', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.removeColumn({ tableName: 'berkas', schema }, 'mandatory');
  }
};
