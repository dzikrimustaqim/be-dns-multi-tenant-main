'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LogActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LogActivity.belongsTo(models.Proguser, { 
        foreignKey: 'id_user',
        targetKey: 'id', 
        as: 'User' 
      });
    }
  }
  LogActivity.init({
    log_level: DataTypes.ENUM("TRACE","DEBUG","INFO","WARN","ERROR","FATAL"),
    module: DataTypes.STRING,
    message: DataTypes.TEXT,
    id_user: DataTypes.UUID,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'log_activities',
    modelName: 'LogActivity',
  });
  return LogActivity;
};