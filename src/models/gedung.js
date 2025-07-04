'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gedung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Gedung.hasMany(models.Rayon, { foreignKey: 'id_gedung', targetKey: 'id', as: 'GedungRayon' })
    }
  };
  Gedung.init({
    nama_gedung: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'gedung',
    modelName: 'Gedung',
  });
  return Gedung;
};