'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permission.hasMany(models.RolePermission, { foreignKey: 'permission_id', targetKey: 'id', as: 'RolePermission' })
    }
  };
  Permission.init({
    module: DataTypes.STRING,
    permission_name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'permission',
    modelName: 'Permission',
  });
  return Permission;
};