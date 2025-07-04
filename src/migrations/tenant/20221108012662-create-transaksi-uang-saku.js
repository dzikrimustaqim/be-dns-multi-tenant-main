'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'transaksi_uang_saku', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_siswa: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_va_transaction: {
        type: Sequelize.UUID,
        references: { model: 'va_transaction', key: 'id' },
        onDelete: 'NO ACTION'
      },
      transaction_type: {
        allowNull: false,
        defaultValue: "DEPOSIT",
        type: Sequelize.ENUM("DEPOSIT","WITHDRAWAL","PAYMENT")
      },
      jenis_pembayaran: {
        allowNull: false,
        defaultValue: "SYSTEM",
        type: Sequelize.ENUM("TUNAI","WALLET","TRANSFER","VIRTUAL_ACCOUNT","SYSTEM")
      },
      amount_type: {
        allowNull: false,
        defaultValue: "KREDIT",
        type: Sequelize.ENUM("DEBET","KREDIT")
      },
      previous_balance: {
        defaultValue: 0,
        type: Sequelize.NUMERIC(10,2)
      },
      amount: {
        defaultValue: 0,
        type: Sequelize.NUMERIC(10,2)
      },
      reversed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      keterangan: {
        type: Sequelize.STRING
      },
      tgl_transaksi: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
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

    await queryInterface.dropTable({ tableName: 'transaksi_uang_saku', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_transaksi_uang_saku_transaction_type";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_transaksi_uang_saku_jenis_pembayaran";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_transaksi_uang_saku_amount_type";`
    );
  }
};