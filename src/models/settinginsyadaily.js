'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SettingInsyaDaily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SettingInsyaDaily.belongsTo(models.TahunAjaran, { 
        foreignKey: 'id_tahun_ajaran', targetKey: 'id', as: 'TahunAjaran' 
      });
      SettingInsyaDaily.belongsTo(models.Tingkat, { 
        foreignKey: 'id_tingkat',
        targetKey: 'id', 
        as: 'Tingkat' 
      });
    }
  }
  SettingInsyaDaily.init({
    tipe: DataTypes.STRING,
    id_tahun_ajaran: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    id_tingkat: DataTypes.INTEGER,
    jumlah_tugas: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'setting_insya_daily',
    modelName: 'SettingInsyaDaily',
  });
  return SettingInsyaDaily;
};