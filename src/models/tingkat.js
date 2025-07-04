'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tingkat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tingkat.belongsTo(models.Lembaga, { foreignKey: 'id_lembaga', targetKey: 'id', as: 'Lembaga' })
      
      Tingkat.hasMany(models.Kelas, { foreignKey: 'id_tingkat', targetKey: 'id', as: 'kelas' })
    }
  }
  Tingkat.init({
    id_lembaga: DataTypes.INTEGER,
    nama_tingkat: DataTypes.STRING,
    urut: DataTypes.INTEGER,
    ppsb: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'tingkat',
    modelName: 'Tingkat',
  });
  return Tingkat;
};