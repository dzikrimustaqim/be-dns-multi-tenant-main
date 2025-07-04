'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankPembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BankPembayaran.init({
    kode: DataTypes.STRING,
    nama: DataTypes.STRING,
    cabang: DataTypes.STRING,
    nomor_rekening: DataTypes.STRING,
    atas_nama: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'bank_pembayaran',
    modelName: 'BankPembayaran',
  });
  return BankPembayaran;
};