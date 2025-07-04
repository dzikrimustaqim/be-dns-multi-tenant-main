'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'kamar', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_rayon: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'rayon', key: 'id' },
        onDelete: 'NO ACTION',
      },
      nama_kamar: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      kuota: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      id_musyrifah: {
        type: Sequelize.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'SET NULL'
      },
      kategori: {
        type: Sequelize.ENUM("PUTRA","PUTRI")
      },
      tempat_tidur: {
        type: Sequelize.ENUM("1_TINGKAT","2_TINGKAT")
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'kamar', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_kamar_kategori";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_kamar_tempat_tidur";`
    );
  }
};