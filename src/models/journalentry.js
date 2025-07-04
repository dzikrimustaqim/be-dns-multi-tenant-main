'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JournalEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  JournalEntry.init({
    created_by: DataTypes.UUID,
    updated_by: DataTypes.UUID,
    debit_chart_id: DataTypes.INTEGER,
    credit_chart_id: DataTypes.INTEGER,
    debit_amount: DataTypes.INTEGER,
    credit_amout: DataTypes.INTEGER,
    invoice_id: DataTypes.UUID,
    receipt_id: DataTypes.UUID,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    is_closed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'JournalEntry',
  });
  return JournalEntry;
};