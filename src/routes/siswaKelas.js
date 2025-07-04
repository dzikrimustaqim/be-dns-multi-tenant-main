const express = require("express");
const siswakelasController = require("../controllers").siswakelas;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", siswakelasController.list);
router.get("/:id", siswakelasController.getById);
router.get("/:periode", siswakelasController.getSiswakelasByPeriode);
router.get("/:periode", siswakelasController.getTotalSiswakelasByPeriode);
router.get(
  "/:periode/:lembaga",
  siswakelasController.getSiswakelasByPeriodeAndLembaga
);
router.get(
  "/:periode/:tingkat",
  siswakelasController.getSiswakelasByPeriodeAndTingkat
);
router.post("/", siswakelasController.add);
router.post("/uploadDataKelas", siswakelasController.insertOrUpdate);
router.post(
  "/uploadDataPeringkat",
  siswakelasController.insertOrUpdatePeringkat
);
router.post("/addBulkData", siswakelasController.addBulkData);
router.post("/updateBulkData", siswakelasController.updateBulkData);
router.post("/getBySemester", siswakelasController.getSiswakelasBySemester);
router.post("/getByKelas", siswakelasController.getSiswakelasByKelas);
router.post("/getBySiswa", siswakelasController.getSiswakelasByPeriodAndSiswa);
router.post("/getPeringkat", siswakelasController.getPeringkatKelas);
router.put("/:id", siswakelasController.update);
router.delete("/:id", siswakelasController.delete);

module.exports = router;
