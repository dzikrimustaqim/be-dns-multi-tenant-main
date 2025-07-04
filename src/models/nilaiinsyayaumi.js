'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiInsyaYaumi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NilaiInsyaYaumi.hasMany(models.NilaiInsyaYaumiSiswa, { foreignKey: 'nilai_insya_yaumi_id', targetKey: 'id', as: 'NilaiInsyaYaumiSiswa' })
    }
  };
  NilaiInsyaYaumi.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    id_kelas: DataTypes.INTEGER,
    tugas_ke: DataTypes.INTEGER,
    id_penginput: DataTypes.UUID
  }, {
    sequelize,
    tableName: 'nilai_insya_yaumi',
    modelName: 'NilaiInsyaYaumi',
  });
  return NilaiInsyaYaumi;
};