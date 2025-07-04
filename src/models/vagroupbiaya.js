'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VaGroupBiaya extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VaGroupBiaya.init({
    id_group_biaya: DataTypes.INTEGER,
    prefix: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'va_group_biaya',
    modelName: 'VaGroupBiaya',
  });
  return VaGroupBiaya;
};