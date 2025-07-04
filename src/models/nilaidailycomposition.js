'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiDailyComposition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  NilaiDailyComposition.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    id_kelas: DataTypes.INTEGER,
    tugas_ke: DataTypes.INTEGER,
    id_penginput: DataTypes.UUID
  }, {
    sequelize,
    tableName: 'nilai_daily_composition',
    modelName: 'NilaiDailyComposition',
  });
  return NilaiDailyComposition;
};