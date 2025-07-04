// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Middleware
const { errorHandler } = require("./middlewares/errorHandler");
const { authenticate, isAdmin } = require("./middlewares/auth");

// Import routes
const roleRoutes = require("./routes/role");
const proguserRoutes = require("./routes/proguser");
const indexRoutes = require("./routes/index");
const fileRoutes = require("./routes/file");
const tahunAjaranRoutes = require("./routes/tahunAjaran");
const rayonRoutes = require("./routes/rayon");
const paketPembayaranRoutes = require("./routes/paketPembayaran");
const siswaRoutes = require("./routes/siswa");
const groupBiayaItemsRoutes = require('./routes/groupBiayaItems');
const groupBiayaRoutes = require('./routes/groupBiaya');
const biayaRoutes = require('./routes/biaya');
const nilaiPpsbRoutes = require('./routes/nilaiPpsb');
const brtRoutes = require('./routes/brt');
const nilaiHarianRoutes = require('./routes/nilaiHarian');
const studentMarkRoutes = require('./routes/studentMark');
const absensiKamarRoutes = require('./routes/absensiKamar');
const absensiRoutes = require('./routes/absensi')
const kepsekRoutes = require('./routes/kepsek');
const siswaKamarRoutes = require('./routes/siswaKamar');
const gedungRoutes = require('./routes/gedung');
const kamarRoutes = require('./routes/kamar');
const bankPembayaranRoute = require("./routes/bankPembayaran");
const itemBiayaRoutes = require("./routes/itemBiaya");
const jenisBayarRoutes = require("./routes/jenisBayar");
const contentRegisRoutes = require("./routes/contentRegis");
const invoiceRoutes = require("./routes/invoice");
const gelombangPendaftaranRoutes = require("./routes/gelombangPendaftaran");
const chartMasterRoutes = require("./routes/chartMaster");
const siswakelasRoutes = require("./routes/siswaKelas");
const guruStudiRoutes = require("./routes/guruStudi");
const kelasRoutes = require("./routes/kelas");
const waliKelasRoutes = require("./routes/waliKelas");
const templateRoutes = require("./routes/template");
const studiRoutes = require("./routes/studi");
const semesterRoutes = require("./routes/semester");
const rekapRoutes = require("./routes/rekap");
const permissionRoutes = require("./routes/permission");
const parentRoutes = require("./routes/parent");
const matapelujiRoutes = require("./routes/matapeluji");
const lokasiUjianRoutes = require("./routes/lokasiUjian");
const logRoutes = require("./routes/log");
const liburMengajarRoutes = require("./routes/liburMengajar");
const jadwalPelajaranRoutes = require("./routes/jadwalPelajaran");
const izinSantriRoutes = require("./routes/izinSantri");
const izinMengajarRoutes = require("./routes/izinMengajar");
const dokumenSyaratRoutes = require("./routes/dokumenSyarat");
const dokumenRoutes = require("./routes/dokumen");
const catatanSiswaRoutes = require("./routes/catatanSiswa");
const biayaKhususRoutes = require("./routes/biayaKhusus");
const berkasRoutes = require("./routes/berkas");

const tenantHandler = require("./middlewares/tenantHandler");
const { template } = require("./controllers");

// Buat Express app
const app = express();

// Middleware dasar
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Route untuk super admin (tanpa tenant resolver)
// app.use('/api/tenants', tenantRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Rute berbasis header
app.use("/coreApi/v1", tenantHandler);

// Rute tenant-specific
app.use("/coreApi/v1/role", roleRoutes);
app.use("/coreApi/v1/proguser", proguserRoutes);
app.use("/coreApi/v1/index", indexRoutes);
app.use("/coreApi/v1/file", fileRoutes);
app.use("/coreApi/v1/tahunajaran", tahunAjaranRoutes);
app.use("/coreApi/v1/rayon", rayonRoutes);
app.use("/coreApi/v1/paketpembayaran", paketPembayaranRoutes);
app.use("/coreApi/v1/siswa", siswaRoutes);
app.use('/coreApi/v1/itemgroupbiaya', groupBiayaItemsRoutes);
app.use('/coreApi/v1/groupbiaya', groupBiayaRoutes);
app.use('/coreApi/v1/biaya', biayaRoutes);
app.use('/coreApi/v1/nilaippsb', nilaiPpsbRoutes);
app.use('/coreApi/v1/brt', brtRoutes);
app.use('/coreApi/v1/nilaiharian', nilaiHarianRoutes);
app.use('/coreApi/v1/studentmark', studentMarkRoutes);
app.use('/coreApi/v1/absensikamar', absensiKamarRoutes);
app.use('/coreApi/v1/absensi', absensiRoutes);
app.use('/coreApi/v1/kepsek', kepsekRoutes);
app.use('/coreApi/v1/siswakamar', siswaKamarRoutes);
app.use('/coreApi/v1/gedung', gedungRoutes);
app.use('/coreApi/v1/kamar', kamarRoutes);
app.use("/coreApi/v1/bankpembayaran", bankPembayaranRoute);
app.use("/coreApi/v1/itembiaya", itemBiayaRoutes);
app.use("/coreApi/v1/jenisbayar", jenisBayarRoutes);
app.use("/coreApi/v1/contentregis", contentRegisRoutes);
app.use("/coreApi/v1/invoice", invoiceRoutes);
app.use("/coreApi/v1/regperiode", gelombangPendaftaranRoutes);
app.use("/coreApi/v1/chartmaster", chartMasterRoutes);
app.use("/coreApi/v1/siswakelas", siswakelasRoutes);
app.use("/coreApi/v1/gurustudi", guruStudiRoutes);
app.use("/coreApi/v1/kelas", kelasRoutes);
app.use("/coreApi/v1/walikelas", waliKelasRoutes);
app.use("/coreApi/v1/template", templateRoutes);
app.use("/coreApi/v1/studi", studiRoutes);
app.use("/coreApi/v1/semester", semesterRoutes);
app.use("/coreApi/v1/rekap", rekapRoutes);
app.use("/coreApi/v1/permission", permissionRoutes);
app.use("/coreApi/v1/parent", parentRoutes);
app.use("/coreApi/v1/matapeluji", matapelujiRoutes);
app.use("/coreApi/v1/lokasiujian", lokasiUjianRoutes);
app.use("/coreApi/v1/log", logRoutes);
app.use("/coreApi/v1/liburmengajar", liburMengajarRoutes);
app.use("/coreApi/v1/jadwalpelajaran", jadwalPelajaranRoutes);
app.use("/coreApi/v1/izinsantri", izinSantriRoutes);
app.use("/coreApi/v1/izinmengajar", izinMengajarRoutes);
app.use("/coreApi/v1/dokumensyarat", dokumenSyaratRoutes);
app.use("/coreApi/v1/dokumen", dokumenRoutes);
app.use("/coreApi/v1/catatansiswa", catatanSiswaRoutes);
app.use("/coreApi/v1/biayakhusus", biayaKhususRoutes);
app.use("/coreApi/v1/berkas", berkasRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
