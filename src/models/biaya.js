'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Biaya extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Biaya.belongsTo(models.JenisBayar, { foreignKey: 'id_jenis_bayar', targetKey: 'id', as: 'PayType' })
      Biaya.belongsTo(models.TahunAjaran, { foreignKey: 'id_periode', targetKey: 'id', as: 'periode' })
    }
  };
  Biaya.init({
    id_periode: DataTypes.INTEGER,
    id_jenis_bayar: DataTypes.INTEGER,
    description: DataTypes.STRING,
    jumlah: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'biaya',
    modelName: 'Biaya',
  });
  return Biaya;
};