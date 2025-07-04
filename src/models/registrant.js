'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Registrant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Registrant.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    telepon: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    id_periode: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'registrant',
    modelName: 'Registrant',
  });
  return Registrant;
};