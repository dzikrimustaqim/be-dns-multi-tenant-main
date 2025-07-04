const express = require('express');
const siswaController = require('../controllers/siswa');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', siswaController.list);
router.get('/getSebaranKotaByPeriod/:periode', siswaController.getSebaranKotaByPeriode);
router.post('/getsiswabyregistrant', siswaController.getByRegistrant);
router.post('/createregistrationva', siswaController.addRegistrationVaNumber);
router.post('/register', siswaController.add);
router.post('/bulkupload', siswaController.bulkInsertSiswa);
router.post('/login', siswaController.login);
router.post('/getByRole', siswaController.listSiswaByRole);
router.put('/updateRegStep', siswaController.changeStep);
router.put('/updatePhotoSiswa', siswaController.updatePhotoSiswa);
router.get('/getSiswaBaru', siswaController.listSiswaBaru);
router.get('/getAllSiswaBaruPenentuanKelas', siswaController.listPenentuanKelasSiswaBaru);
router.get('/getAllSiswaTahunAjaranAktif', siswaController.listSiswaTahunAjaranAktive);
router.get('/getBukuInduk', siswaController.listBukuInduk);
router.get('/getSiswaBaruDouble', siswaController.getSiswaDouble);
router.get('/getRekapLokasiUjian', siswaController.getRekapLokasiUjian);
router.get('/getRekapTanggalUjian', siswaController.getRekapTanggalUjian);
router.get('/getSiswaDokumen', siswaController.listSiswaDokumen);
router.get('/:id', siswaController.getById);
router.put('/changePassword', siswaController.changePassword);
router.put('/:id', siswaController.update);
router.delete('/:id', siswaController.delete);

module.exports = router;