'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JenisBayar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // define association here
      JenisBayar.belongsTo(models.Biaya, { 
        foreignKey: 'id',
        targetKey: 'id_jenis_bayar', 
        as: 'biaya' 
      });
    }
  };
  JenisBayar.init({
    nama_bayar: DataTypes.STRING,
    kode_bayar: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'jenis_bayar',
    modelName: 'JenisBayar',
  });
  return JenisBayar;
};