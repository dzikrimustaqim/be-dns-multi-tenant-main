const express = require('express');
const biayaController = require('../controllers/biaya');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/biayabyid/:id', biayaController.getById);
router.get('/:periode', biayaController.getByPeriode);
router.get('/biayaregistrasi/:periode', biayaController.getBiayaRegistrasiByPeriode);
router.get('/currentbiayaregistrasi', biayaController.getBiayaRegistrasiByAktivePeriode);
router.post('/', biayaController.add);
router.delete('/:id', biayaController.delete);
router.put('/:id', biayaController.update);

module.exports = router;