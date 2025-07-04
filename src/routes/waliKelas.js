const express = require("express");
const waliKelasController = require("../controllers/walikelas");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", waliKelasController.list);
router.get("/getByPeriode", waliKelasController.getWalikelasByPeriode);
router.get(
  "/getByPeriodeAndKelas/:periode/:kelas",
  waliKelasController.getByPeriodeAndKelas
);
router.get("/:id", waliKelasController.getById);
router.post("/", waliKelasController.add);
router.put("/:id", waliKelasController.update);
router.delete("/:id", waliKelasController.delete);

module.exports = router;
