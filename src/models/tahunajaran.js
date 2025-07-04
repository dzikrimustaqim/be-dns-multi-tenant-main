'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TahunAjaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TahunAjaran.hasMany(models.Semester, { foreignKey: 'periode_id', targetKey: 'id', as: 'Semester' })
    }
  };
  TahunAjaran.init({
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    ppsb: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'tahun_ajaran',
    modelName: 'TahunAjaran',
  });
  return TahunAjaran;
};