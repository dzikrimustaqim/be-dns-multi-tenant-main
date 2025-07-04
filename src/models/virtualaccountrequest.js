'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VirtualAccountRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VirtualAccountRequest.init({
    id_provider: DataTypes.UUID,
    id_tagihan_item: DataTypes.UUID,
    requested_amount: DataTypes.NUMERIC,
    virtual_account_number: DataTypes.STRING,
    transaction_ref: DataTypes.STRING,
    virtual_account_expiry: DataTypes.DATE,
    request_date: DataTypes.DATE,
    va_status: DataTypes.ENUM("CREATE","UPDATE","DELETE","INQUIRY","ON_PROCESS","AKTIVE","NONAKTIVE","ERROR")
  }, {
    sequelize,
    tableName: 'virtual_account_request',
    modelName: 'VirtualAccountRequest',
  });
  return VirtualAccountRequest;
};