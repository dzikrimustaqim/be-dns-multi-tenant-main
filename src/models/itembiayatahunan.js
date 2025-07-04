'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemBiayaTahunan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemBiayaTahunan.belongsTo(models.ItemBiaya, { foreignKey: 'id_item_biaya', targetKey: 'id', as: 'ItemsItemBiayaTahunan' });
      ItemBiayaTahunan.belongsTo(models.BiayaTahunan, { foreignKey: 'id_biaya_tahunan', targetKey: 'id', as: 'PeriodeItemBiayaTahunan' });
      ItemBiayaTahunan.belongsTo(models.GroupBiaya, { foreignKey: 'id_group_biaya', targetKey: 'id', as: 'GroupBiayaItemBiayaTahunan' });
    }
  };
  ItemBiayaTahunan.init({
    id_biaya_tahunan: DataTypes.INTEGER,
    id_group_biaya: DataTypes.INTEGER,
    id_item_biaya: DataTypes.INTEGER,
    nilai_biaya: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'item_biaya_tahunan',
    modelName: 'ItemBiayaTahunan',
  });
  return ItemBiayaTahunan;
};