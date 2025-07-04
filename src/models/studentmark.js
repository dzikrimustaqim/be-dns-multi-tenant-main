'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentMark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentMark.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    tipe: DataTypes.STRING,
    id_studi: DataTypes.STRING,
    id_siswa: DataTypes.UUID,
    markvalue: DataTypes.NUMERIC
  }, {
    sequelize,
    tableName: 'student_mark',
    modelName: 'StudentMark',
  });
  return StudentMark;
};