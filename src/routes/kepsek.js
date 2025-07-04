const express = require('express');
const kepsekController = require('../controllers/kepsek');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', kepsekController.list);
router.get('/:id', kepsekController.getById);
router.get('/kepsekbytahunajaran/:id', kepsekController.getByTahunAjaran);
router.post('/', kepsekController.add);
router.put('/:id', kepsekController.update);
router.delete('/:id', kepsekController.delete);

module.exports = router;