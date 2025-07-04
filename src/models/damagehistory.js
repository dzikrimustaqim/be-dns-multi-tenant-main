'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DamageHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DamageHistory.init({
    damage_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    proguser_id: DataTypes.UUID,
    photo: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'damage_history',
    modelName: 'DamageHistory',
  });
  return DamageHistory;
};