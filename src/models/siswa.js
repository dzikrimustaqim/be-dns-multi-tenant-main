'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Siswa.belongsTo(models.Role, { 
        foreignKey: 'role_id',
        targetKey: 'id', 
        as: 'role' 
      });

      Siswa.belongsTo(models.Parent, { 
        foreignKey: 'parent_id',
        targetKey: 'id', 
        as: 'parent' 
      });

      Siswa.belongsTo(models.Tingkat, { 
        foreignKey: 'tingkat_id',
        targetKey: 'id', 
        as: 'tingkat' 
      });
      Siswa.belongsTo(models.Lembaga, { 
        foreignKey: 'lembaga_tujuan',
        targetKey: 'id', 
        as: 'lembaga' 
      });

      Siswa.hasMany(models.NomorVa, { foreignKey: 'siswa_id', targetKey: 'id', as: 'NomorVa' })
      Siswa.hasMany(models.Tagihan, { foreignKey: 'id_siswa', targetKey: 'id', as: 'SiswaTagihan' })
      Siswa.hasMany(models.DokumenSyarat, { foreignKey: 'id_siswa', targetKey: 'id', as: 'SiswaDokumenSyarat' })
      Siswa.hasOne(models.Siswakelas, { 
        foreignKey: 'siswa_id', 
        as: 'siswaKelas', 
        onDelete: 'NO ACTION' 
      });
      Siswa.hasOne(models.SiswaKamar, { 
        foreignKey: 'id_siswa', 
        as: 'siswaKamar', 
        onDelete: 'NO ACTION' 
      });
    }
  }
  Siswa.init({
    registrant_id: DataTypes.UUID,
    regnumber: DataTypes.STRING,
    no_induk: DataTypes.STRING,
    parent_id: DataTypes.UUID,
    role_id: DataTypes.INTEGER,
    tingkat_id: DataTypes.INTEGER,
    reg_date: DataTypes.DATE,
    angkatan: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    nisn: DataTypes.STRING,
    npsn: DataTypes.STRING,
    nss: DataTypes.STRING,
    no_ijazah: DataTypes.STRING,
    tempat_ijazah: DataTypes.STRING,
    tahun_lulus: DataTypes.STRING,
    alamat_sekolah_asal: DataTypes.STRING,
    nama_lengkap: DataTypes.STRING,
    nama_panggilan: DataTypes.STRING,
    nama_arab: DataTypes.STRING,
    agama: DataTypes.STRING,
    agama_ayah: DataTypes.STRING,
    agama_ibu: DataTypes.STRING,
    photo: DataTypes.STRING,
    nik: DataTypes.STRING,
    gender: DataTypes.ENUM("L","P"),
    pob: DataTypes.STRING,
    dob: DataTypes.DATE,
    anak_ke: DataTypes.INTEGER,
    jumlah_anak: DataTypes.INTEGER,
    telepon: DataTypes.STRING,
    handphone: DataTypes.STRING,
    fax: DataTypes.STRING,
    riwayat_penyakit: DataTypes.STRING,
    kelainan_jasmani: DataTypes.STRING,
    berat_badan: DataTypes.STRING,
    tinggi_badan: DataTypes.STRING,
    golongan_darah: DataTypes.ENUM("A","B","AB","O"),
    hoby: DataTypes.STRING,
    hoby_kesenian: DataTypes.STRING,
    hoby_olahraga: DataTypes.STRING,
    hoby_menggambar: DataTypes.STRING,
    hoby_lain_lain: DataTypes.STRING,
    email: DataTypes.STRING,
    email_rumah: DataTypes.STRING,
    saudara_kandung_aktif: DataTypes.STRING,
    sumber_info_sekolah: DataTypes.STRING,
    lembaga_tujuan: DataTypes.INTEGER,
    kelas_tujuan: DataTypes.INTEGER,
    ukuran_baju: DataTypes.STRING,
    asal_sekolah: DataTypes.STRING,
    nama_sekolah_asal: DataTypes.STRING,
    tanggal_lulus: DataTypes.DATE,
    pilihan_pesantren_kedua: DataTypes.STRING,
    no_kk: DataTypes.STRING,
    nama_ayah: DataTypes.STRING,
    nama_ayah_arab: DataTypes.STRING,
    nik_ayah: DataTypes.STRING,
    status_ayah: DataTypes.STRING,
    pob_ayah: DataTypes.STRING,
    dob_ayah: DataTypes.DATE,
    gelar_akademik_ayah: DataTypes.STRING,
    status_hidup_ayah: DataTypes.ENUM("HIDUP","MENINGGAL"),
    pendidikan_terkahir_ayah: DataTypes.STRING,
    pekerjaan_ayah: DataTypes.STRING,
    jabatan_ayah: DataTypes.STRING,
    penghasilan_perbulan_ayah: DataTypes.INTEGER,
    penghasilan_tidak_tetap_perbulan_ayah: DataTypes.INTEGER,
    telp_ayah: DataTypes.STRING,
    telp_ayah2: DataTypes.STRING,
    telp_kantor_ayah: DataTypes.STRING,
    hp_kantor_ayah: DataTypes.STRING,
    fax_kantor_ayah: DataTypes.STRING,
    email_ayah: DataTypes.STRING,
    website_ayah: DataTypes.STRING,
    alamat_ayah: DataTypes.TEXT,
    nama_dan_alamat_tempat_kerja_ayah: DataTypes.TEXT,
    nama_ibu: DataTypes.STRING,
    nama_ibu_arab: DataTypes.STRING,
    nik_ibu: DataTypes.STRING,
    status_ibu: DataTypes.STRING,
    pob_ibu: DataTypes.STRING,
    dob_ibu: DataTypes.DATE,
    gelar_akademik_ibu: DataTypes.STRING,
    status_hidup_ibu: DataTypes.ENUM("HIDUP","MENINGGAL"),
    pendidikan_terkahir_ibu: DataTypes.STRING,
    pekerjaan_ibu: DataTypes.STRING,
    jabatan_ibu: DataTypes.STRING,
    penghasilan_perbulan_ibu: DataTypes.INTEGER,
    penghasilan_tidak_tetap_perbulan_ibu: DataTypes.INTEGER,
    telp_ibu: DataTypes.STRING,
    telp_ibu2: DataTypes.STRING,
    telp_kantor_ibu: DataTypes.STRING,
    hp_kantor_ibu: DataTypes.STRING,
    fax_kantor_ibu: DataTypes.STRING,
    email_ibu: DataTypes.STRING,
    website_ibu: DataTypes.STRING,
    alamat_ibu: DataTypes.TEXT,
    nama_dan_alamat_tempat_kerja_ibu: DataTypes.TEXT,
    status_keluarga: DataTypes.STRING,
    yang_menanggung_biaya: DataTypes.ENUM("AYAH","IBU","LAINNYA"),
    nama_penanggung_biaya: DataTypes.STRING,
    hubungan_keluarga_penanggung_biaya: DataTypes.STRING,
    telepon_penanggung_biaya: DataTypes.STRING,
    pekerjaan_penanggung_biaya: DataTypes.STRING,
    alamat_penanggung_biaya: DataTypes.TEXT,
    kewarganegaraan: DataTypes.ENUM("WNI","WNA"),
    kewarganegaraan_suku_ayah: DataTypes.STRING,
    kewarganegaraan_suku_ibu: DataTypes.STRING,
    negara: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    rt: DataTypes.STRING,
    rw: DataTypes.STRING,
    provinsi: DataTypes.STRING,
    kodepos: DataTypes.STRING,
    kota_kab: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    desa_kelurahan: DataTypes.STRING,
    lokasi_ujian: DataTypes.STRING,
    current_status: DataTypes.ENUM("REGISTRATION","REGISTRATION_FEE","FILL_REGISTRATION_DATA","DOCUMENT_VALIDATION","ENTRANCE_EXAMINATION","ENTRY_TUITION_FEE","INFORMATION","ACCEPTED"),
    status: DataTypes.ENUM("REG","ACTIVE","ALUMNI","MUTATION","DO"),
    active: DataTypes.BOOLEAN,
    daftar_ulang: DataTypes.BOOLEAN,
    admin_input: DataTypes.BOOLEAN,
    tanggal_ujian: DataTypes.DATE,
    nama_darurat: DataTypes.STRING,
    hubungan_keluarga_darurat: DataTypes.STRING,
    telepon_darurat: DataTypes.STRING,
    telepon_kantor_darurat: DataTypes.STRING,
    kelebihan_anak: DataTypes.TEXT,
    kekurangan_anak: DataTypes.TEXT,
    kondisi_lingkungan: DataTypes.TEXT,
    note_teman_dekat: DataTypes.TEXT,
    nama_teman_dekat: DataTypes.STRING,
    sekolah_teman_dekat: DataTypes.STRING,
    alamat_teman_dekat: DataTypes.STRING,
    telepon_teman_dekat: DataTypes.STRING,
    hp_teman_dekat: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'siswa',
    modelName: 'Siswa',
  });
  return Siswa;
};