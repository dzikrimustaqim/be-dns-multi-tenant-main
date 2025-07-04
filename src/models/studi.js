'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Studi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Studi.init({
    kode_studi: DataTypes.STRING,
    nama_studi: DataTypes.STRING,
    nama_studi_en: DataTypes.STRING,
    nama_studi_ar: DataTypes.STRING,
    relasi_nilai: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    is_nilai_harian: DataTypes.BOOLEAN,
    is_nilai_mid: DataTypes.BOOLEAN,
    is_nilai_semester: DataTypes.BOOLEAN,
    tipe_kalkulasi: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'studi',
    modelName: 'Studi',
  });
  return Studi;
};