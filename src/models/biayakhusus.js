'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BiayaKhusus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BiayaKhusus.belongsTo(models.GroupBiaya, { 
        foreignKey: 'id_group_biaya',
        targetKey: 'id',
        as: 'GroupBiaya'
      });
    }
  }
  BiayaKhusus.init({
    id_siswa: DataTypes.UUID,
    id_group_biaya: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'biaya_khusus',
    modelName: 'BiayaKhusus',
  });
  return BiayaKhusus;
};