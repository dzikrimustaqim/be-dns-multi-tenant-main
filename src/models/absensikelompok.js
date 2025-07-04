'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiKelompok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AbsensiKelompok.init({
    nama_kelompok: DataTypes.STRING,
    kategori: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'absensi_kelompok',
    modelName: 'AbsensiKelompok',
  });
  return AbsensiKelompok;
};