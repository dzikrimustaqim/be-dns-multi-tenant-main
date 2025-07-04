'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TemplateSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TemplateSetting.init({
    template: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'template_setting',
    modelName: 'TemplateSetting',
  });
  return TemplateSetting;
};