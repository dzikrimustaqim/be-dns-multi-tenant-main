'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'kepsek', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_tahun_ajaran: {
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      tipe: {
        type: Sequelize.ENUM("KEPSEK","WK_KEPSEK","DIREKTUR","WK_DIREKTUR")
      },
      id_user: {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'SET NULL'
      },
      deskripsi: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'kepsek', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_kepsek_tipe";`
    );
  }
};