const express = require('express');
const roleController = require('../controllers').role;
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', roleController.list);
router.post('/', roleController.add);
router.get('/rolestaff', roleController.listForStaff);
router.get('/:id', roleController.getById);
router.put('/:id', roleController.update);
router.delete('/:id', roleController.delete);
router.post('/rolepermission', roleController.addPermission);
router.post('/getBySlug', roleController.getBySlug);

module.exports = router;