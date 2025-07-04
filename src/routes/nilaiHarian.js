const express = require('express');
const nilaiharianController = require('../controllers/nilaiharian');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.post('/getNilaiQuran', nilaiharianController.getNilaiQuran);
router.post('/getListNilaiQuran', nilaiharianController.getListInputNilaiQuranSiswa);
router.post('/saveNilaiQuran', nilaiharianController.addOrUpdateNilaiQuran);
router.post('/getLaporanNilaiQuran', nilaiharianController.getLaporanNilaiQuran);
router.post('/getListLaporanNilaiQuranSiswa', nilaiharianController.getListLaporanNilaiQuranSiswa);

router.post('/getNilaiInsya', nilaiharianController.getNilaiInsya);
router.post('/getListNilaiInsya', nilaiharianController.getListInputNilaiInsyaSiswa);
router.post('/saveNilaiInsya', nilaiharianController.addOrUpdateNilaiInsya);
router.post('/getLaporanNilaiInsya', nilaiharianController.getLaporanNilaiInsya);
router.post('/getListLaporanNilaiInysaYaumiSiswa', nilaiharianController.getListLaporanNilaiInysaYaumiSiswa);

router.post('/getNilaiDailyComposition', nilaiharianController.getNilaiDailyComposition);
router.post('/getListNilaiDailyComposition', nilaiharianController.getListInputNilaiDailyCompositionSiswa);
router.post('/saveNilaiDailyComposition', nilaiharianController.addOrUpdateNilaiDailyComposition);
router.post('/getListLaporanNilaiDailyCompositionSiswa', nilaiharianController.getListLaporanNilaiDailyCompositionSiswa);

router.post('/getNilaiIbadahAmaliah', nilaiharianController.getNilaiIbadahAmaliah);
router.post('/getListNilaiIbadahaAmaliah', nilaiharianController.getListInputNilaiIbadahAmaliahSiswa);
router.post('/saveNilaiIbadahAmaliah', nilaiharianController.addOrUpdateNilaiDailyIbadahAmaliah);

module.exports = router;