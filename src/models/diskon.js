'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diskon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Diskon.init({
    id_group_biaya: DataTypes.INTEGER,
    deskripsi: DataTypes.STRING,
    tipe: DataTypes.ENUM("FIXED","PERCENTAGE"),
    jumlah: DataTypes.NUMERIC(10,2)
  }, {
    sequelize,
    tableName: 'diskon',
    modelName: 'Diskon',
  });
  return Diskon;
};