'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TagihanItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TagihanItem.init({
    id_tagihan: DataTypes.UUID,
    id_group_biaya: DataTypes.INTEGER,
    tipe_tagihan: DataTypes.ENUM("BULANAN","BEBAS"),
    deskripsi: DataTypes.STRING,
    original_amount: DataTypes.NUMERIC,
    amount: DataTypes.NUMERIC,
    discount: DataTypes.NUMERIC,
    fine: DataTypes.NUMERIC,
    paid_amount: DataTypes.NUMERIC,
  }, {
    sequelize,
    tableName: 'tagihan_item',
    modelName: 'TagihanItem',
  });
  return TagihanItem;
};