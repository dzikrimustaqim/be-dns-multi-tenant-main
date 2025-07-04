const express = require('express');
const groupbiayaController = require('../controllers/groupbiaya');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', groupbiayaController.list);
router.post('/', groupbiayaController.add);
router.put('/:id', groupbiayaController.update);
router.get('/:id', groupbiayaController.getById);
router.get('/groupbiayabylembagaandperiode/:id_lembaga/:periode', groupbiayaController.getByLembagaAndPeriode);

module.exports = router;