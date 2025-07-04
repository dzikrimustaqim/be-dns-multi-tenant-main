const express = require('express');
const paketpembayaranController = require('../controllers/paketpembayaran');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', paketpembayaranController.list);
router.get('/:id', paketpembayaranController.getById);
router.get('/paketpembayaranbyidlembaga/:id_lembaga', paketpembayaranController.getPaketPembayaranByLembaga);
router.get('/paketpembayaranbyidlembagaandperiode/:id/:id_lembaga/:periode', paketpembayaranController.getByIdLembagaAndPeriod);
router.get('/groupbiayabiayaregistrasi/:id_lembaga/:periode', paketpembayaranController.getBiayaRegistrasi);
router.post('/', paketpembayaranController.add);
router.post('/totalpaketpembayaran', paketpembayaranController.getTotalAmountByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya);
router.put('/:id', paketpembayaranController.update);
router.delete('/:id', paketpembayaranController.delete);
router.get('/paketpembayaranbylembagaandperiode/:id_lembaga/:periode', paketpembayaranController.getByLembagaAndPeriode);
router.get('/paketpembayaranbylembagaandpaketpembayaranandperiode/:id_lembaga/:id_paket/:periode', paketpembayaranController.getByLembagaAndPaketPembayaranAndPeriode);

module.exports = router;