const express = require("express");
const berkasController = require("../controllers/berkas");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", berkasController.list);
router.post("/", berkasController.add);
router.get("/:id", berkasController.getById);
router.delete("/:id", berkasController.delete);
router.put("/:id", berkasController.update);
router.get("/getSiswaBerkas/:idsiswa", berkasController.getAllSiswaBerkas);

module.exports = router;
