'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DamagePhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DamagePhoto.init({
    damage_id: DataTypes.UUID,
    url: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'damage_photo',
    modelName: 'DamagePhoto',
  });
  return DamagePhoto;
};