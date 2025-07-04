'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HasilPpsb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HasilPpsb.belongsTo(models.Siswa, { 
        foreignKey: 'id_siswa',
        targetKey: 'id', 
        as: 'SiswaHasilPpsb' 
      });

      HasilPpsb.belongsTo(models.Tagihan, { 
        foreignKey: 'id_tagihan',
        targetKey: 'id', 
        as: 'TagihanHasilPpsb' 
      });

      HasilPpsb.belongsTo(models.PaketPembayaran, { 
        foreignKey: 'id_paket_biaya',
        targetKey: 'id', 
        as: 'PaketPembayaranHasilPpsb' 
      });
      HasilPpsb.belongsTo(models.Proguser, { 
        foreignKey: 'id_penguji',
        targetKey: 'id', 
        as: 'PengujiHasilPpsb' 
      });
      HasilPpsb.belongsTo(models.Proguser, { 
        foreignKey: 'id_user_input',
        targetKey: 'id', 
        as: 'UserInputHasilPpsb' 
      });
      HasilPpsb.belongsTo(models.TahunAjaran, { 
        foreignKey: 'id_tahun_ajaran',
        targetKey: 'id', 
        as: 'TahunAjaranHasilPpsb' 
      });
      HasilPpsb.belongsTo(models.Tingkat, { 
        foreignKey: 'id_tingkat',
        targetKey: 'id', 
        as: 'Tingkat' 
      });
    }
  }
  HasilPpsb.init({
    id_siswa: DataTypes.UUID,
    id_tahun_ajaran: DataTypes.INTEGER,
    id_penguji: DataTypes.UUID,
    id_user_input: DataTypes.UUID,
    status_kelulusan: DataTypes.ENUM("lulus_murni","lulus_bersyarat","lulus_cabang","lulus_tidak_mendapat_tempat","lulus_cadangan","tidak_lulus","menunggu_ujian"),
    id_lembaga: DataTypes.INTEGER,
    id_tingkat: DataTypes.INTEGER,
    id_lembaga_biaya: DataTypes.INTEGER,
    id_paket_biaya: DataTypes.INTEGER,
    id_tagihan: DataTypes.UUID,
    id_gelombang: DataTypes.INTEGER,
    catatan_penguji: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'hasil_ppsb',
    modelName: 'HasilPpsb',
  });
  return HasilPpsb;
};