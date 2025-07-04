'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Alat.init({
    kategori_id: DataTypes.INTEGER,
    nama_alat: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'alat',
    modelName: 'Alat',
  });
  return Alat;
};