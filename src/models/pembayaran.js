'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pembayaran.belongsTo(models.Tagihan, { 
        foreignKey: 'id_tagihan',
        targetKey: 'id', 
        as: 'pembayaranTagihan' 
      });
    }
  };
  Pembayaran.init({
    id_tagihan: DataTypes.UUID,
    waktu_transaksi: DataTypes.DATE,
    jumlah: DataTypes.NUMERIC,
    jenis_pembayaran: DataTypes.ENUM("TUNAI","WALLET","TRANSFER","VIRTUAL_ACCOUNT"),
    external_id: DataTypes.STRING,
    referensi: DataTypes.STRING,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'pembayaran',
    modelName: 'Pembayaran',
  });
  return Pembayaran;
};