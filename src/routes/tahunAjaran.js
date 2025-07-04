const express = require('express');
const tahunAjaranController = require('../controllers/tahunajaran');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', tahunAjaranController.list);
router.get('/active', tahunAjaranController.getTahunAjaranAktif);
router.get('/getOpenRegister', tahunAjaranController.getTahunPendaftaranAktif);
router.get('/:id', tahunAjaranController.getById);
router.post('/', tahunAjaranController.add);
router.put('/:id', tahunAjaranController.update);
router.delete('/:id', tahunAjaranController.delete);

module.exports = router;