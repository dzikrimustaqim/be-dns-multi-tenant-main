'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parent.belongsTo(models.Role, { 
        foreignKey: 'role_id',
        targetKey: 'id', 
        as: 'role' 
      });
    }
  };
  Parent.init({
    role_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    nama_ar: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'parent',
    modelName: 'Parent',
  });
  return Parent;
};