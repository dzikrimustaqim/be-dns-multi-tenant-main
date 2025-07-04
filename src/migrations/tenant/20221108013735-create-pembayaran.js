'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'pembayaran', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_tagihan: {
        type: Sequelize.UUID,
        references: { model: 'tagihan', key: 'id' },
        onDelete: 'NO ACTION'
      },
      waktu_transaksi: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      jumlah: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.NUMERIC(10,2)
      },
      jenis_pembayaran: {
        type: Sequelize.ENUM("TUNAI","WALLET","TRANSFER","VIRTUAL_ACCOUNT")
      },
      external_id: {
        type: Sequelize.STRING
      },
      referensi: {
        type: Sequelize.STRING
      },
      keterangan: {
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
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'pembayaran', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_pembayaran_jenis_pembayaran";`
    );
  }
};