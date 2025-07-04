'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransaksiUangSaku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TransaksiUangSaku.init({
    id_siswa: DataTypes.STRING,
    id_va_transaction: DataTypes.UUID,
    transaction_type: DataTypes.ENUM("DEPOSIT","WITHDRAWAL","PAYMENT"),
    jenis_pembayaran: DataTypes.ENUM("TUNAI","WALLET","TRANSFER","VIRTUAL_ACCOUNT","SYSTEM"),
    amount_type: DataTypes.ENUM("DEBET","KREDIT"),
    previous_balance: DataTypes.NUMERIC,
    amount: DataTypes.NUMERIC,
    reversed: DataTypes.BOOLEAN,
    keterangan: DataTypes.STRING,
    tgl_transaksi: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'transaksi_uang_saku',
    modelName: 'TransaksiUangSaku',
  });
  return TransaksiUangSaku;
};