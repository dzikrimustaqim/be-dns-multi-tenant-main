'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NomorIndukSequence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NomorIndukSequence.init({
    angkatan: DataTypes.STRING,
    gender: DataTypes.STRING,
    sequence: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'nomor_induk_sequence',
    modelName: 'NomorIndukSequence',
  });
  return NomorIndukSequence;
};