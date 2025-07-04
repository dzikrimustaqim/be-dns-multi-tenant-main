'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupBiayaItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupBiayaItem.belongsTo(models.GroupBiaya, { 
        foreignKey: 'id_group_biaya',
        targetKey: 'id'
      });
    }
  };
  GroupBiayaItem.init({
    id_item_biaya: DataTypes.INTEGER,
    id_group_biaya: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'group_biaya_item',
    modelName: 'GroupBiayaItem',
  });
  return GroupBiayaItem;
};