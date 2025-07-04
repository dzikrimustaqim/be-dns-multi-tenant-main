'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportNonmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReportNonmark.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    id_siswa: DataTypes.UUID,
    alpha: DataTypes.INTEGER,
    sakit: DataTypes.INTEGER,
    izin_pribadi: DataTypes.INTEGER,
    izin_tugas: DataTypes.INTEGER,
    keseriusan: DataTypes.STRING,
    kesehatan: DataTypes.STRING,
    ketekunan: DataTypes.STRING,
    perilaku: DataTypes.NUMERIC,
    kebersihan: DataTypes.NUMERIC,
    kehadiran: DataTypes.NUMERIC
  }, {
    sequelize,
    tableName: 'report_nonmark',
    modelName: 'ReportNonmark',
  });
  return ReportNonmark;
};