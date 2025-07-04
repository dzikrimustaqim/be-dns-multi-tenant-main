'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VirtualAccountType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VirtualAccountType.init({
    id_virtual_account_provider: DataTypes.UUID,
    prefix: DataTypes.STRING,
    va_type: DataTypes.ENUM('NON_FIXED','FIXED_CLOSE','FIXED_OPEN')
  }, {
    sequelize,
    tableName: 'virtual_account_type',
    modelName: 'VirtualAccountType',
  });
  return VirtualAccountType;
};