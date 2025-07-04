'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasOne(models.Proguser, { 
        foreignKey: 'role_id', 
        as: 'userRole', 
        onDelete: 'NO ACTION' 
      });

      Role.hasOne(models.Parent, { 
        foreignKey: 'role_id', 
        as: 'parentRole', 
        onDelete: 'NO ACTION' 
      });

      Role.hasOne(models.Siswa, { 
        foreignKey: 'role_id', 
        as: 'siswaRole', 
        onDelete: 'NO ACTION' 
      });

      Role.hasMany(models.RolePermission, { foreignKey: 'role_id', targetKey: 'id', as: 'RolePermission' })
    }
  };
  Role.init({
    role_name: DataTypes.STRING,
    slug: DataTypes.STRING,
    editable: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'role',
    modelName: 'Role',
  });
  return Role;
};