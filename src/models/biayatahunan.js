'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BiayaTahunan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BiayaTahunan.belongsTo(models.PaketPembayaran, { 
        foreignKey: 'id_paket_pembayaran',
        targetKey: 'id', 
        as: 'TahunanPaketPembayaran' 
      });

      // BiayaTahunan.belongsTo(models.Lembaga, { 
      //   foreignKey: 'id_lembaga',
      //   targetKey: 'id', 
      //   as: 'TahunanLembaga' 
      // });

      BiayaTahunan.belongsToMany(models.GroupBiaya, {
        through: "GroupBiayaBiayaTahunan",
        foreignKey: 'id_biaya_tahunan',
        as: 'groupbiayatahunan'
      });

      BiayaTahunan.belongsToMany(models.ItemBiaya, {
        through: "item_biaya_tahunan",
        foreignKey: 'id_biaya_tahunan',
        as: 'itembiayabiayatahunan'
      });

      BiayaTahunan.hasMany(models.ItemBiayaTahunan, { foreignKey: 'id_biaya_tahunan', targetKey: 'id', as: 'ItemBiayaTahunan' })
    }
  };
  BiayaTahunan.init({
    id_paket_pembayaran: DataTypes.INTEGER,
    id_periode: DataTypes.INTEGER,
    total_biaya: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'biaya_tahunan',
    modelName: 'BiayaTahunan',
  });
  return BiayaTahunan;
};