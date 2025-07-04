const express = require('express');
const siswakamarController = require('../controllers/siswakamar');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/siswakamarbyperiodandkamar/:idperiod/:id', siswakamarController.getByPeriodAndKamar);
router.post('/siswakamarbygedungasramakamar', siswakamarController.getByGedungAsranmaKamar);
router.post('/', siswakamarController.add);
router.put('/:id', siswakamarController.update);
router.delete('/:id', siswakamarController.delete);

module.exports = router;