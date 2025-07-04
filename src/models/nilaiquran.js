'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiQuran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NilaiQuran.hasMany(models.NilaiQuranSiswa, { foreignKey: 'nilai_quran_id', targetKey: 'id', as: 'NilaiQuranSiswa' })
    }
  };
  NilaiQuran.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    bulan: DataTypes.ENUM("Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"),
    id_kelas: DataTypes.INTEGER,
    id_penginput: DataTypes.UUID
  }, {
    sequelize,
    tableName: 'nilai_quran',
    modelName: 'NilaiQuran',
  });
  return NilaiQuran;
};