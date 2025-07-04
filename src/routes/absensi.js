const express = require('express');
const absensiController = require('../controllers/absensi');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.post('/getabsensiguruinput', absensiController.getGuruInput);
router.post('/absensiharian', absensiController.getAbsensiHarianSiswa);
router.post('/absensiharianbyabsen', absensiController.getAbsensiHarianByAbsen);
router.post('/absensiguruinput', absensiController.addGuruInput);
router.post('/absensihariansiswa', absensiController.addAbsensiHarianSiswa);
router.post('/listinputabsensihariansiswa', absensiController.getListInputAbsensiHarianSiswa);
router.post('/listinputabsensihariansiswabydaterange', absensiController.getAbsensiHarianSiswaByDateRange);
router.post('/listinputabsensihariansiswaperkategori', absensiController.getAbsensiHarianSiswaPerKategori);
router.post('/listinputabsensihariansiswaperkategorijamke', absensiController.getAbsensiHarianSiswaPerKategoriJamke);
router.post('/getmonitoringabsensiharian', absensiController.getMonitoringAbsensiHarianSiswa);

module.exports = router;