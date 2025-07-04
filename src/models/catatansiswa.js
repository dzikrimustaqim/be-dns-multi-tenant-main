'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatatanSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CatatanSiswa.belongsTo(models.Siswa, { foreignKey: 'siswa_id', targetKey: 'id', as: 'Siswa' });
      CatatanSiswa.belongsTo(models.Proguser, { foreignKey: 'guru_id', targetKey: 'id', as: 'Proguser' });
    }
  };
  CatatanSiswa.init({
    absensi_id: DataTypes.UUID,
    siswa_id: DataTypes.UUID,
    guru_id: DataTypes.UUID,
    tanggal: DataTypes.DATE,
    catatan_positif: DataTypes.TEXT,
    catatan_negatif: DataTypes.TEXT,
  }, {
    sequelize,
    tableName: 'catatan_siswa',
    modelName: 'CatatanSiswa',
  });
  return CatatanSiswa;
};