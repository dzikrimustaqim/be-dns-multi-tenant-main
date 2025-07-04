'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StaffProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StaffProfile.belongsTo(models.Proguser, { 
        foreignKey: 'id_user',
        targetKey: 'id', 
        as: 'user' 
      });
    }
  }
  StaffProfile.init({
    id_user: DataTypes.INTEGER,
    nik: DataTypes.STRING,
    real_name: DataTypes.STRING,
    name_ar: DataTypes.STRING,
    gelar_akademik: DataTypes.STRING,
    pob: DataTypes.STRING,
    dob: DataTypes.DATE,
    gender: DataTypes.ENUM('L','P'),
    hobby: DataTypes.STRING,
    photo: DataTypes.STRING,
    sign: DataTypes.STRING,
    marital_status: DataTypes.ENUM("Belum Menikah","Menikah"),
    facebook: DataTypes.STRING,
    instagram: DataTypes.STRING,
    twitter: DataTypes.STRING,
    no_hp1: DataTypes.STRING,
    no_hp2: DataTypes.STRING,
    golongan_darah: DataTypes.ENUM("A","B","AB","O"),
    ayah: DataTypes.STRING,
    ibu: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    rt: DataTypes.STRING,
    rw: DataTypes.STRING,
    provinsi: DataTypes.STRING,
    kodepos: DataTypes.STRING,
    kota_kab: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    desa_kelurahan: DataTypes.STRING,
    kode_guru_nip: DataTypes.STRING,
    nuptk: DataTypes.STRING,
    kode_guru_nip: DataTypes.STRING,
    kode_guru_nip: DataTypes.STRING,
    kode_guru_nip: DataTypes.STRING,
    aktifitas_luar_pondok: DataTypes.TEXT,
    rekomendasi: DataTypes.TEXT,
    status: DataTypes.ENUM("Aktif","Non-Aktif","Cuti"),
    tahun_bertugas: DataTypes.STRING,
    tanggal_masuk: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'staff_profile',
    modelName: 'StaffProfile',
  });
  return StaffProfile;
};