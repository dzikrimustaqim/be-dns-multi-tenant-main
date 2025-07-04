'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tagihan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Tagihan.belongsTo(models.Siswa, { 
        foreignKey: 'id_siswa',
        targetKey: 'id', 
        as: 'siswaTagihan' 
      });

      Tagihan.hasOne(models.Pembayaran, { 
        foreignKey: 'id_tagihan', 
        as: 'pembayaran', 
        onDelete: 'NO ACTION' 
      });

      Tagihan.hasMany(models.TagihanItem, { 
        foreignKey: 'id_tagihan', 
        targetKey: 'id', 
        as: 'TagihanItem' 
      });
      
      Tagihan.hasMany(models.Reminder, { 
        foreignKey: 'id_tagihan', 
        targetKey: 'id', 
        as: 'Remminder' 
      });
    }
  };
  Tagihan.init({
    id_siswa: DataTypes.UUID,
    nomor: DataTypes.STRING,
    tanggal_tagihan: DataTypes.DATE,
    tanggal_jatuh_tempo: DataTypes.DATE,
    nilai_tagihan: DataTypes.INTEGER,
    status_pembayaran: DataTypes.ENUM("LUNAS","DIBAYAR_SEBAGIAN","BELUM_DIBAYAR"),  
    keterangan: DataTypes.STRING,
    bulan_tagihan: DataTypes.INTEGER,
    tahun_tagihan: DataTypes.INTEGER,
    status_tagihan: DataTypes.ENUM("AKTIF","NONAKTIF"),    
    status_notifikasi: DataTypes.ENUM("BELUM_TERKIRIM","SUDAH_TERKIRIM")
  }, {
    sequelize,
    tableName: 'tagihan',
    modelName: 'Tagihan',
  });
  return Tagihan;
};