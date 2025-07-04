'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IzinSantri extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IzinSantri.init({
    id_siswa: DataTypes.STRING,
    id_periode: DataTypes.INTEGER,
    id_kelas: DataTypes.INTEGER,
    id_kamar: DataTypes.INTEGER,
    tujuan: DataTypes.ENUM("RUMAH","SEKITAR","TUGAS PONDOK","KAMAR","LAIN-LAIN"),
    keperluan: DataTypes.STRING,
    tgl_jam_berangkat: DataTypes.DATE,
    tgl_jam_kembali: DataTypes.DATE,
    tanda_tangan_title: DataTypes.ENUM("Bagian Pengasuhan","Bagian Keamanan","Kepala Pengasuhan","Pimpinan Pondok"),
    nama_penjemput: DataTypes.STRING,
    hubungan_penjemput: DataTypes.STRING,
    lapor_kembali: DataTypes.ENUM("Ya","Tidak"),
    id_penginput: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'izin_santri',
    modelName: 'IzinSantri',
  });
  return IzinSantri;
};