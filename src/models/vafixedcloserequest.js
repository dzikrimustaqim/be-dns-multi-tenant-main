'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VaFixedCloseRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VaFixedCloseRequest.init({
    id_provider: DataTypes.UUID,
    prefix: DataTypes.STRING,
    id_tagihan_item: DataTypes.UUID,
    requested_amount: DataTypes.NUMERIC,
    virtual_account_number: DataTypes.STRING,
    transaction_ref: DataTypes.STRING,
    virtual_account_expiry: DataTypes.DATE,
    request_date: DataTypes.DATE,
    va_status: DataTypes.ENUM("CREATE","UPDATE","DELETE","INQUIRY","ON_PROCESS","AKTIVE","NONAKTIVE","ERROR")
  }, {
    sequelize,
    tableName: 'va_fixed_close_request',
    modelName: 'VaFixedCloseRequest',
  });
  return VaFixedCloseRequest;
};