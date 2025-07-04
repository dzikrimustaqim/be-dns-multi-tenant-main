const express = require('express');
const nilaiPpsbController = require('../controllers/nilaippsb');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.post('/', nilaiPpsbController.add);
router.post('/generatevadanapangkal', nilaiPpsbController.generateVaDanaPangkal);
router.get('/hasilppsb/:id', nilaiPpsbController.getHasilSiswaPpsb);
router.get('/listnilaippsb', nilaiPpsbController.listNilaiPpsb);
router.get('/:id', nilaiPpsbController.getNilaiSiswaPpsb);
router.get('/listhasilppsb/:idperiode', nilaiPpsbController.list);
router.delete('/hasilppsb/:id', nilaiPpsbController.delete);
router.put('/:id', nilaiPpsbController.update);

module.exports = router;