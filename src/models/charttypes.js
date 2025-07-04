'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChartTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChartTypes.init({
    name: DataTypes.STRING,
    type_id: DataTypes.INTEGER,
    class_id: DataTypes.INTEGER,
    parent: DataTypes.INTEGER,
    inactive: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'chart_type',
    modelName: 'ChartTypes',
  });
  return ChartTypes;
};