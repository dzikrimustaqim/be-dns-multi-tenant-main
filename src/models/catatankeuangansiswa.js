'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatatanKeuanganSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CatatanKeuanganSiswa.init({
    id_siswa: DataTypes.UUID,
    id_user: DataTypes.UUID,
    catatan: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'catatan_keuangan_siswa',
    modelName: 'CatatanKeuanganSiswa',
  });
  return CatatanKeuanganSiswa;
};