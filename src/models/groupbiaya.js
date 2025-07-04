'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupBiaya extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //GroupBiaya.belongsToMany(models.ItemBiaya, { through: 'group_biaya_item', foreignKey: 'id_group_biaya' });
      GroupBiaya.belongsTo(models.ChartMaster, { 
        foreignKey: 'id_akun',
        targetKey: 'id', 
        as: 'akun' 
      });
      //GroupBiaya.hasMany(models.GroupBiayaItem, { foreignKey: 'id_group_biaya', targetKey: 'id', as: 'Group___Biaya___Item' })
      GroupBiaya.belongsToMany(models.ItemBiaya, {
        through: "GroupBiayaItem",
        foreignKey: 'id_group_biaya',
        as: 'biayaitems'
      });

      GroupBiaya.belongsToMany(models.BiayaTahunan, {
        through: "GroupBiayaBiayaTahunan",
        foreignKey: 'id_group_biaya',
        as: 'groupbiayatahunan'
      });
    }
  };
  GroupBiaya.init({
    name: DataTypes.STRING,
    kode: DataTypes.STRING,
    id_akun: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'group_biaya',
    modelName: 'GroupBiaya',
  });
  return GroupBiaya;
};