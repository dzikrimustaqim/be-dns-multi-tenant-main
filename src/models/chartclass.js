'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChartClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChartClass.init({
    class_name: DataTypes.STRING,
    ctype: DataTypes.ENUM("CL_NONE","CL_ASSETS","CL_EQUITY","CL_INCOME","CL_COGS","CL_EXPENSE"),
    inactive: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'chart_class',
    modelName: 'ChartClass',
  });
  return ChartClass;
};