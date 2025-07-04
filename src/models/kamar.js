'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kamar.belongsTo(models.Proguser, { 
        foreignKey: 'id_musyrifah',
        targetKey: 'id', 
        as: 'ProguserKamar' 
      });

      Kamar.belongsTo(models.Rayon, { 
        foreignKey: 'id_rayon',
        targetKey: 'id', 
        as: 'RayonKamar' 
      });

      Kamar.hasMany(models.PeriodeKamar, { foreignKey: 'id_kamar', targetKey: 'id', as: 'PeriodeKamar' })
    }
  };
  Kamar.init({
    id_rayon: DataTypes.INTEGER,
    nama_kamar: DataTypes.STRING,
    kuota: DataTypes.INTEGER,
    id_musyrifah: DataTypes.UUID,
    kategori: DataTypes.ENUM("PUTRA","PUTRI"),
    tempat_tidur: DataTypes.ENUM("1_TINGKAT","2_TINGKAT"),
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'kamar',
    modelName: 'Kamar',
  });
  return Kamar;
};