'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NilaiUjianPpsb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NilaiUjianPpsb.belongsTo(models.HasilPpsb, { 
        foreignKey: 'id_hasil_ppsb',
        targetKey: 'id', 
        as: 'NilaiUjianHasilPpsb' 
      });

      NilaiUjianPpsb.belongsTo(models.MatapelUji, { 
        foreignKey: 'id_matapel_uji',
        targetKey: 'id', 
        as: 'NilaiUjianMatapelUji' 
      });
    }
  }
  NilaiUjianPpsb.init({
    id_hasil_ppsb: DataTypes.UUID,
    id_matapel_uji: DataTypes.INTEGER,
    nilai: DataTypes.NUMERIC(3,2),
    keterangan: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'nilai_ujian_ppsb',
    modelName: 'NilaiUjianPpsb',
  });
  return NilaiUjianPpsb;
};