'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DokumenSyarat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DokumenSyarat.belongsTo(models.Siswa, { foreignKey: 'id_siswa', targetKey: 'id', as: 'Siswa' })
      DokumenSyarat.belongsTo(models.Berkas, { foreignKey: 'berkas_id', targetKey: 'id', as: 'Berkas' })
    }
  }
  DokumenSyarat.init({
    id_siswa: DataTypes.INTEGER,
    berkas_id: DataTypes.INTEGER,
    urut: DataTypes.INTEGER,
    nama_dokumen: DataTypes.STRING,
    file_url: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'dokumen_syarat',
    modelName: 'DokumenSyarat',
  });
  return DokumenSyarat;
};