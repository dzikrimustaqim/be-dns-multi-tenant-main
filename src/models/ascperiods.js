'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AscPeriods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AscPeriods.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    period: DataTypes.STRING,
    name: DataTypes.STRING,
    short: DataTypes.STRING,
    starttime: DataTypes.STRING,
    endtime: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'asc_periods',
    modelName: 'AscPeriods',
  });
  return AscPeriods;
};