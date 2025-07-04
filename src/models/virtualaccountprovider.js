'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VirtualAccountProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VirtualAccountProvider.init({
    provider_name: DataTypes.STRING,
    api_key: DataTypes.STRING,
    api_secret: DataTypes.STRING,
    url: DataTypes.STRING,
    basic_auth_username: DataTypes.STRING,
    basic_auth_password: DataTypes.STRING,
    signature: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'virtual_account_provider',
    modelName: 'VirtualAccountProvider',
  });
  return VirtualAccountProvider;
};