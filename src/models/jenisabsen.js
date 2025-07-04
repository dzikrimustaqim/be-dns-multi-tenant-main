'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JenisAbsen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  JenisAbsen.init({
    jenis: DataTypes.STRING,
    kategori: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'jenis_absen',
    modelName: 'JenisAbsen',
  });
  return JenisAbsen;
};