'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Berkas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Berkas.belongsTo(models.DokumenSyarat, { 
        foreignKey: 'id',
        targetKey: 'berkas_id', 
        as: 'dokumen' 
      });
    }
  };
  Berkas.init({
    nama_dokumen: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    urut: DataTypes.INTEGER,
    mandatory: DataTypes.BOOLEAN,
  }, {
    sequelize,
    tableName: 'berkas',
    modelName: 'Berkas',
  });
  return Berkas;
};