'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RolePermission.belongsTo(models.Role, { foreignKey: 'role_id', targetKey: 'id', as: 'Role' });
      RolePermission.belongsTo(models.Permission, { foreignKey: 'permission_id', targetKey: 'id', as: 'Permission' });
    }
  };
  RolePermission.init({
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'role_permission',
    modelName: 'RolePermission',
  });
  return RolePermission;
};