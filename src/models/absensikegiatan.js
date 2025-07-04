'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiKegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AbsensiKegiatan.init({
    periode_id: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    jenis_absen_id: DataTypes.INTEGER,
    absensi_kelompok_id: DataTypes.INTEGER,
    keterangan: DataTypes.TEXT,
    proguser_id: DataTypes.UUID
  }, {
    sequelize,
    tableName: 'absensi_kegiatan',
    modelName: 'AbsensiKegiatan',
  });
  return AbsensiKegiatan;
};