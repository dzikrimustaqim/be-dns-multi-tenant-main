'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lembaga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lembaga.hasMany(models.Tingkat, { foreignKey: 'id_lembaga', targetKey: 'id', as: 'Tingkat' })
    }
  }
  Lembaga.init({
    nama_lembaga: DataTypes.STRING,
    urut: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'lembaga',
    modelName: 'Lembaga',
  });
  return Lembaga;
};