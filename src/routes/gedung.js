const express = require('express');
const gedungController = require('../controllers/gedung');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', gedungController.list);
router.get('/:id', gedungController.getById);
router.post('/', gedungController.add);
router.put('/:id', gedungController.update);
router.delete('/:id', gedungController.delete);

module.exports = router;