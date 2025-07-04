'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'diskon', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_group_biaya: {
        type: Sequelize.INTEGER,
        references: { model: 'group_biaya', key: 'id' },
        onDelete: 'NO ACTION'
      },      
      deskripsi: {
        type: Sequelize.STRING
      },
      tipe: {
        type: Sequelize.ENUM("FIXED","PERCENTAGE")
      },
      jumlah: {
        type: Sequelize.NUMERIC(10,2)
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

    await queryInterface.dropTable({ tableName: 'diskon', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_diskon_tipe";`
    );
  }
};