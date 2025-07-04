'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proguser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Proguser.belongsTo(models.Role, { 
        foreignKey: 'role_id',
        targetKey: 'id', 
        as: 'Role' 
      });

      Proguser.hasOne(models.StaffProfile, { 
        foreignKey: 'id_user', 
        as: 'userProfile', 
        onDelete: 'NO ACTION' 
      });
    }


  };
  Proguser.init({
    role_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'proguser',
    modelName: 'Proguser',
  });
  return Proguser;
};