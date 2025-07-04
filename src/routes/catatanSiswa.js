const express = require("express");
const catatanSiswaController = require("../controllers/catatansiswa");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", catatanSiswaController.list);
router.get("/:id", catatanSiswaController.getById);
router.post("/", catatanSiswaController.add);
router.put("/:id", catatanSiswaController.update);
router.delete("/:id", catatanSiswaController.delete);

module.exports = router;
