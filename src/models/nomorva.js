'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NomorVa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NomorVa.init({
    siswa_id: DataTypes.UUID,
    akun: DataTypes.ENUM("PSB","SPP","PANGKAL","SAKU"),
    nomor: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'nomor_va',
    modelName: 'NomorVa',
  });
  return NomorVa;
};