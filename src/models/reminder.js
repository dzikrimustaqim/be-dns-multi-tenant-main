'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reminder.init({
    id_tagihan: DataTypes.UUID,
    tanggal_penjadwalan: DataTypes.DATE,
    tipe_reminder: DataTypes.ENUM("DUE_DATE","OVER_DUE","PARTIAL_PAYMENT"),
    kanal: DataTypes.ENUM("EMAIL","SMS","WHATSAPP"),
    terkirim: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'reminder',
    modelName: 'Reminder',
  });
  return Reminder;
};