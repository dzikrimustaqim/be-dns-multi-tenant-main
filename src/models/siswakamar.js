'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SiswaKamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SiswaKamar.belongsTo(models.Kamar, { foreignKey: 'id_kamar', targetKey: 'id', as: 'Kamar' });
      SiswaKamar.belongsTo(models.Siswa, { foreignKey: 'id_siswa', targetKey: 'id', as: 'Siswa' });
    }
  };
  SiswaKamar.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    id_siswa: DataTypes.UUID,
    id_kamar: DataTypes.INTEGER,
    nomor_urut: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'siswa_kamar',
    modelName: 'SiswaKamar',
  });
  return SiswaKamar;
};