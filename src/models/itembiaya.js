'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemBiaya extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //ItemBiaya.belongsToMany(models.GroupBiaya, { through: 'group_biaya_item' });
      ItemBiaya.belongsToMany(models.GroupBiaya, {
        through: "GroupBiayaItem",
        foreignKey: 'id_item_biaya',
        as: 'groupbiaya'
      });

      ItemBiaya.belongsToMany(models.BiayaTahunan, {
        through: "item_biaya_tahunan",
        foreignKey: 'id_item_biaya',
        as: 'itembiayatahunan'
      });
    }
  };
  ItemBiaya.init({
    item_name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'item_biaya',
    modelName: 'ItemBiaya',
  });
  return ItemBiaya;
};