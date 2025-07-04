const express = require("express");
const lokasiujianController = require("../controllers/lokasiujian");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", lokasiujianController.list);
router.get("/:id", lokasiujianController.getById);
router.get("aktif", lokasiujianController.getLokasiUjianAktif);
router.post("/", lokasiujianController.add);
router.put("/:id", lokasiujianController.update);
router.delete("/:id", lokasiujianController.delete);

module.exports = router;
