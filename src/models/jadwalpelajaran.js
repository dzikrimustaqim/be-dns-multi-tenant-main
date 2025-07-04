'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JadwalPelajaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  JadwalPelajaran.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    kelas_id: DataTypes.INTEGER,
    day: DataTypes.ENUM("Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday", "Friday"),
    jamke: DataTypes.INTEGER,
    studi_id: DataTypes.INTEGER,
    guru_id: DataTypes.UUID,
    asc_guru_id: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'jadwal_pelajaran',
    modelName: 'JadwalPelajaran',
  });
  return JadwalPelajaran;
};