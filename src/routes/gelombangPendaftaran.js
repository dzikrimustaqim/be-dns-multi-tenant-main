const express = require("express");
const gelombagpendaftaranController =
  require("../controllers").gelombangpendaftaran;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

/* GelombangPendaftaran Router */
router.get(
  "/",
  gelombagpendaftaranController.getAllGelombangPendaftaranCurrentPeriod
);
router.get("/:id", gelombagpendaftaranController.getById);
router.put("/:id", gelombagpendaftaranController.update);
router.delete("/:id", gelombagpendaftaranController.delete);
router.post("/", gelombagpendaftaranController.add);
router.get(
  "/getactivereg",
  gelombagpendaftaranController.getGelombangPendaftaranAktif
);
router.get(
  "/getregbytahun/:tahun",
  gelombagpendaftaranController.getGelombangPendaftaranByTahunAjaran
);

module.exports = router;
