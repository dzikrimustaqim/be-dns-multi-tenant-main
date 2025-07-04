'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BiayaKhususItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BiayaKhususItem.belongsTo(models.ItemBiaya, { 
        foreignKey: 'id_item_biaya', 
        targetKey: 'id', 
        as: 'ItemBiaya' 
      });
    }
  }
  BiayaKhususItem.init({
    id_biaya_khusus: DataTypes.UUID,
    id_item_biaya: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'biaya_khusus_item',
    modelName: 'BiayaKhususItem',
  });
  return BiayaKhususItem;
};