'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiInsyaYaumiSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NilaiInsyaYaumiSiswa.belongsTo(models.Siswa, { foreignKey: 'siswa_id', targetKey: 'id', as: 'Siswa' });
    }
  };
  NilaiInsyaYaumiSiswa.init({
    nilai_insya_yaumi_id: DataTypes.UUID,
    siswa_id: DataTypes.UUID,
    nilai: DataTypes.NUMERIC,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'nilai_insya_yaumi_siswa',
    modelName: 'NilaiInsyaYaumiSiswa',
  });
  return NilaiInsyaYaumiSiswa;
};