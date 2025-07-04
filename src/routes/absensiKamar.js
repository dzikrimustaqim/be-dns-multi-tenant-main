const express = require('express');
const absensiController = require('../controllers/absensi');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.post('/getabsensiguruinputkamar', absensiController.getGuruInputKamar);
router.post('/absensiguruinputkamar', absensiController.addGuruInputKamar);
router.post('/absensikamar', absensiController.getAbsensiHarianKamar);
router.post('/absensihariankamar', absensiController.addAbsensiHarianKamar);
router.post('/listinputabsensihariankamar', absensiController.getListInputAbsensiHarianKamar);
router.post('/absensikamarbyabsen', absensiController.getAbsensiKamarByAbsen);
router.post('/listinputabsensihariankamarbydaterange', absensiController.getAbsensiHarianKamarByDateRange);
router.post('/listinputabsensihariankamarbymonth', absensiController.getAbsensiHarianKamarByMonth);
router.post('/listinputabsensihariankamarpenginput', absensiController.getAbsensiHarianKamarPenginput);

module.exports = router;