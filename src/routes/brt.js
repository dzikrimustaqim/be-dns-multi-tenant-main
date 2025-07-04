const express = require('express');
const brtController = require('../controllers/brt');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/kategorialat', brtController.listKategoriAlat);
router.post('/addkategorialat', brtController.addKategoriAlat);
router.put('/updatekategorialat/:id', brtController.updateKategoriAlat);
router.get('/damage', brtController.listDamage);

module.exports = router;