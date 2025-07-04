'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChartMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChartMaster.init({
    account_code: DataTypes.STRING,
    account_code2: DataTypes.STRING,
    account_name: DataTypes.STRING,
    account_type: DataTypes.INTEGER,
    inactive: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'chart_master',
    modelName: 'ChartMaster',
  });
  return ChartMaster;
};