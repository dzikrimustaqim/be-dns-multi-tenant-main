const express = require('express');
const groupbiayaitemsController = require('../controllers/groupbiayaitems');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', groupbiayaitemsController.list);
router.post('/', groupbiayaitemsController.add);
router.delete('/:id', groupbiayaitemsController.delete);

module.exports = router;