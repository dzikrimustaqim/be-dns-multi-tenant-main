'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MatapelUji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MatapelUji.init({
    nama_studi: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'matapel_uji',
    modelName: 'MatapelUji',
  });
  return MatapelUji;
};