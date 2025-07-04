'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DataAbsensiKegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DataAbsensiKegiatan.init({
    absensi_kegiatan_id: DataTypes.UUID,
    siswa_id: DataTypes.UUID,
    h: DataTypes.BOOLEAN,
    a: DataTypes.BOOLEAN,
    s: DataTypes.BOOLEAN,
    ip: DataTypes.BOOLEAN,
    it: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'data_absensi_kegiatan',
    modelName: 'DataAbsensiKegiatan',
  });
  return DataAbsensiKegiatan;
};