'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiHarianSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AbsensiHarianSiswa.belongsTo(models.Siswa, { foreignKey: 'siswa_id', targetKey: 'id', as: 'Siswa' });
      AbsensiHarianSiswa.hasOne(models.CatatanSiswa, { 
        foreignKey: 'absensi_id',
        targetKey: 'id', 
        as: 'CatatanSiswa'
      });
    }
  };
  AbsensiHarianSiswa.init({
    absensi_guru_input_id: DataTypes.UUID,
    siswa_id: DataTypes.UUID,
    absen: DataTypes.ENUM("H","A","S","IT","IP"),
    catatan_positif: DataTypes.TEXT,
    catatan_negatif: DataTypes.TEXT,
    siswa_status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'absensi_harian_siswa',
    modelName: 'AbsensiHarianSiswa',
  });
  return AbsensiHarianSiswa;
};