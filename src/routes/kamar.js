const express = require('express');
const kamarController = require('../controllers/kamar');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', kamarController.list);
router.get('/kamarbyrayon', kamarController.getByRayon);
router.get('/kamarbykategori', kamarController.getByKategori);
router.get('/:id', kamarController.getById);
router.post('/', kamarController.add);
router.put('/:id', kamarController.update);
router.delete('/:id', kamarController.delete);
router.post('/kamarbyperiode/:id', kamarController.getPeriodeKamar);
router.post('/periodekamarbykamar', kamarController.getPeriodeKamarByKamar);

module.exports = router;