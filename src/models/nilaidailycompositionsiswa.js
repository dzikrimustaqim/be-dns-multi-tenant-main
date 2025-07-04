'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiDailyCompositionSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  NilaiDailyCompositionSiswa.init({
    nilai_daily_composition_id: DataTypes.UUID,
    siswa_id: DataTypes.UUID,
    nilai: DataTypes.NUMERIC,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'nilai_daily_composition_siswa',
    modelName: 'NilaiDailyCompositionSiswa',
  });
  return NilaiDailyCompositionSiswa;
};