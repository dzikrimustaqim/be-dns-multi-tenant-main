const express = require('express');
const studentmarkController = require('../controllers/studentmark');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', studentmarkController.list);
router.get('/:id', studentmarkController.getById);
router.post('/', studentmarkController.addNilaiRaportHarian);
router.post('/studentmarknonnilai', studentmarkController.addNilaiRaportNonNilai);
router.post('/getListNilaiRaportHarian', studentmarkController.getListInputNilaiRaportHarian);
router.post('/getListNilaiRaportSemester', studentmarkController.getListInputNilaiRaportSemester);
router.post('/getListNilaiRaportNonmark', studentmarkController.getListInputNilaiRaportNonMark);
router.put('/:id', studentmarkController.update);
router.delete('/:id', studentmarkController.delete);

module.exports = router;