'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiGuruInput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AbsensiGuruInput.belongsTo(models.JadwalPelajaran, { foreignKey: 'jadwal_pelajaran_id', targetKey: 'id', as: 'JadwalPelajaran' });
      AbsensiGuruInput.hasMany(models.AbsensiHarianSiswa, { foreignKey: 'absensi_guru_input_id', targetKey: 'id', as: 'AbsensiGuruInput' })
      
    }
  };
  AbsensiGuruInput.init({
    jadwal_pelajaran_id: DataTypes.UUID,
    tanggal: DataTypes.DATE,
    materi: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
    guru_penginput_id: DataTypes.UUID,
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
    tableName: 'absensi_guru_input',
    modelName: 'AbsensiGuruInput',
  });
  return AbsensiGuruInput;
};