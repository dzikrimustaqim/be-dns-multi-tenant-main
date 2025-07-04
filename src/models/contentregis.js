'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContentRegis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ContentRegis.init({
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'content_regis',
    modelName: 'ContentRegis',
  });
  return ContentRegis;
};