'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BuktiTransfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BuktiTransfer.init({
    id_pembayaran: DataTypes.UUID,
    file_bukti: DataTypes.STRING,
    tanggal_upload: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'bukti_transfer',
    modelName: 'BuktiTransfer',
  });
  return BuktiTransfer;
};