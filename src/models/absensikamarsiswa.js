'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiKamarSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbsensiKamarSiswa.init({
    absensi_kamar_id: DataTypes.UUID,
    siswa_id: DataTypes.UUID,
    absen: DataTypes.ENUM("H","A","S","IT","IP"),
    catatan_positif: DataTypes.TEXT,
    catatan_negatif: DataTypes.TEXT,
    siswa_status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'absensi_kamar_siswa',
    modelName: 'AbsensiKamarSiswa',
  });
  return AbsensiKamarSiswa;
};