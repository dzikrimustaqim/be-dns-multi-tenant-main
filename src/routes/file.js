const express = require('express');
const fileController = require('../controllers/file');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.post("/upload", fileController.upload);
router.get("/remove/:type/:name", fileController.remove);
router.get("/getdokumen/:type/:name", fileController.showDokumen);

module.exports = router;