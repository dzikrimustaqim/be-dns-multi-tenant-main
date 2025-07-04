'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kelas.belongsTo(models.Tingkat, { 
        foreignKey: 'id_tingkat',
        targetKey: 'id', 
        as: 'tingkatkelas' 
      });
    }
  };
  Kelas.init({
    id_tingkat: DataTypes.INTEGER,
    kode_kelas: DataTypes.STRING,
    nama_kelas: DataTypes.STRING,
    nama_kelas_ar: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    urut: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'kelas',
    modelName: 'Kelas',
  });
  return Kelas;
};