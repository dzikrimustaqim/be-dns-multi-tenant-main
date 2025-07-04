'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiKamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbsensiKamar.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    id_kamar: DataTypes.INTEGER,
    guru_penginput_id: DataTypes.UUID,
    tanggal: DataTypes.DATE,
    completed: DataTypes.BOOLEAN,
    is_replacement: DataTypes.BOOLEAN,
    total_siswa: DataTypes.INTEGER,
    jumlah_siswa_aktif: DataTypes.INTEGER,
    availability: DataTypes.ENUM("Y","N"),
    reason: DataTypes.STRING,
    total_h: DataTypes.INTEGER,
    total_a: DataTypes.INTEGER,
    total_s: DataTypes.INTEGER,
    total_ip: DataTypes.INTEGER,
    total_it: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'absensi_kamar',
    modelName: 'AbsensiKamar',
  });
  return AbsensiKamar;
};