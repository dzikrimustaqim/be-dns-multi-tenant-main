'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaketPembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PaketPembayaran.belongsTo(models.Lembaga, { 
        foreignKey: 'id_lembaga',
        targetKey: 'id', 
        as: 'PaketPembayaranLembaga' 
      });
      //BiayaTahunan
      PaketPembayaran.hasMany(models.BiayaTahunan, { foreignKey: 'id_paket_pembayaran', targetKey: 'id', as: 'PaketBiayaTahunan' })
    }
  };
  PaketPembayaran.init({
    nama_paket: DataTypes.STRING,
    id_lembaga: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'paket_pembayaran',
    modelName: 'PaketPembayaran',
  });
  return PaketPembayaran;
};