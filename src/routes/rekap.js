const express = require("express");
const rekapController = require("../controllers/rekap");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.post(
  "/pembayaranformulirperlembaga",
  rekapController.getRekapPembayaranFormuirPerLembaga
);
router.post("/rekapTahapanProses", rekapController.getRekapTahapanProses);
router.post("/rekapStatusKelulusan", rekapController.getRekapStatusKelulusan);
router.post(
  "/pembayaranformulirpertingkat",
  rekapController.getRekapPembayaranFormuirPerTingkat
);

module.exports = router;
