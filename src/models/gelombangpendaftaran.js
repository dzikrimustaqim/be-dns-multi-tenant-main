'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GelombangPendaftaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GelombangPendaftaran.belongsTo(models.TahunAjaran, { 
        foreignKey: 'id_tahun_ajaran',
        targetKey: 'id', 
        as: 'Periode' 
      });
    }
  }
  GelombangPendaftaran.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    title: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    ujian_tulis_date: DataTypes.DATE,
    ujian_lisan_date: DataTypes.DATE,
    pengumuman_kelulusan_date: DataTypes.DATE,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'gelombang_pendaftaran',
    modelName: 'GelombangPendaftaran',
  });
  return GelombangPendaftaran;
};