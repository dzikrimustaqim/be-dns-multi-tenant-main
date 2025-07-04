'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VaTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VaTransaction.init({
    virtual_account_number: DataTypes.STRING,
    transaction_ref: DataTypes.STRING,
    amount: DataTypes.NUMERIC,
    payment_date: DataTypes.DATE,
    status: DataTypes.ENUM("SUCCESS","FAILED","PENDING")
  }, {
    sequelize,
    tableName: 'va_transaction',
    modelName: 'VaTransaction',
  });
  return VaTransaction;
};