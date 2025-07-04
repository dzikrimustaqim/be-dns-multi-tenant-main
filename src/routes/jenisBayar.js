const express = require("express");
const jenisbayarController = require("../controllers").jenisbayar;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

/* Jenis Bayar Router */
router.get("/alljenisbayar", jenisbayarController.listAll);
router.get("/:periode", jenisbayarController.getByPeriode);

module.exports = router;
