const express = require('express');
const proguserController = require('../controllers').proguser;
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// tidak membutuhkan autentikasi
router.post('/login', proguserController.login);

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get('/', proguserController.list);
router.put('/changePassword', proguserController.changePassword);
router.put('/changePhoto', proguserController.changePhoto);
router.put('/changeSign', proguserController.changeSign);
router.post('/register', proguserController.add);
router.post('/getByRole', proguserController.listProguserByRole);
router.get('/:id', proguserController.getById);
router.put('/:id', proguserController.update);
router.delete('/:id', proguserController.delete);

module.exports = router;