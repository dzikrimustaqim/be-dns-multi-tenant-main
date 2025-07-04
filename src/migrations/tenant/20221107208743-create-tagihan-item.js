'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'tagihan_item', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_tagihan: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: 'tagihan', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_group_biaya: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'group_biaya', key: 'id' },
        onDelete: 'NO ACTION'
      },
      tipe_tagihan: {
        allowNull: false,
        defaultValue: "BEBAS",
        type: Sequelize.ENUM("BULANAN","BEBAS")
      },
      deskripsi: {
        type: Sequelize.STRING
      },      
      original_amount: {
        type: Sequelize.NUMERIC(10,2),
        defaultValue: 0
      },
      amount: {
        type: Sequelize.NUMERIC(10,2),
        defaultValue: 0
      },
      discount: {
        type: Sequelize.NUMERIC(10,2),
        defaultValue: 0
      },
      fine: {
        type: Sequelize.NUMERIC(10,2),
        defaultValue: 0
      },
      paid_amount: {
        type: Sequelize.NUMERIC(10,2),
        defaultValue: 0
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

    await queryInterface.dropTable({ tableName: 'tagihan_item', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_tagihan_item_tipe_tagihan";`
    );
  }
};