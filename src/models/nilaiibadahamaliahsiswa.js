'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiIbadahAmaliahSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NilaiIbadahAmaliahSiswa.init({
    nilai_ibadah_amaliah_id: DataTypes.UUID,
    siswa_id: DataTypes.UUID,
    nilai: DataTypes.NUMERIC,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'nilai_ibadah_amaliah_siswa',
    modelName: 'NilaiIbadahAmaliahSiswa',
  });
  return NilaiIbadahAmaliahSiswa;
};