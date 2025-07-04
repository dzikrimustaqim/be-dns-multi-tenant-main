'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Damage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Damage.init({
    kategori: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    ruangan: DataTypes.STRING,
    kelas: DataTypes.STRING,
    alat_id: DataTypes.INTEGER,
    detail: DataTypes.TEXT,
    priority: DataTypes.ENUM('Low','Medium','High'),
    status: DataTypes.ENUM('OPEN','IN PROGRESS','CLOSE'),
    proguser_id: DataTypes.UUID
  }, {
    sequelize,
    tableName: 'damage',
    modelName: 'Damage',
  });
  return Damage;
};