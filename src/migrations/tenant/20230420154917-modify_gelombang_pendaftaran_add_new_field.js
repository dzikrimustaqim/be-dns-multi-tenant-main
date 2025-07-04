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

    await queryInterface.addColumn({ tableName: 'gelombang_pendaftaran', schema }, 'ujian_tulis_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    
    await queryInterface.addColumn({ tableName: 'gelombang_pendaftaran', schema }, 'ujian_lisan_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn({ tableName: 'gelombang_pendaftaran', schema }, 'pengumuman_kelulusan_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
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

    await queryInterface.removeColumn({ tableName: 'gelombang_pendaftaran', schema }, 'ujian_tulis_date');
    await queryInterface.removeColumn({ tableName: 'gelombang_pendaftaran', schema }, 'ujian_lisan_date');
    await queryInterface.removeColumn({ tableName: 'gelombang_pendaftaran', schema }, 'pengumuman_kelulusan_date');
  }
};
