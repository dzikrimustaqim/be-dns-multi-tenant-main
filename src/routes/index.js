var express = require("express");
var router = express.Router();
var multer = require("multer");
const uploadMem = multer({ storage: multer.memoryStorage() });

const lembagaController = require("../controllers").lembaga;
const tingkatController = require("../controllers").tingkat;
const registrantController = require("../controllers").registrant;
const biayatahunanController = require("../controllers").biayatahunan;
const settinginsyadailyController = require("../controllers").settinginsyadaily;
//const biayatahunanController = require("../controllers").biayatahunan;
//const settinginsyadailyController = require("../controllers").settinginsyadaily;
const pembayaranController = require("../controllers").pembayaran;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Lembaga Router */
router.get("/lembaga", lembagaController.list);
router.get("/lembaga/:id", lembagaController.getById);
router.post("/lembaga", lembagaController.add);
router.put("/lembaga/:id", lembagaController.update);
router.delete("/lembaga/:id", lembagaController.delete);
router.get("/lembagabyinstansi/:id", lembagaController.getByInstansi);

/* Tingkat Router */
router.get("/tingkat", tingkatController.list);
router.get("/tingkat/:id", tingkatController.getById);
router.post("/tingkat", tingkatController.add);
router.put("/tingkat/:id", tingkatController.update);
router.delete("/tingkat/:id", tingkatController.delete);
router.get("/tingkatbylembaga/:id", tingkatController.getByLembaga);

/* Registrant Router */
router.get("/registrant", registrantController.list);
router.post("/registrant/register", registrantController.add);
router.post("/registrant/login", registrantController.login);
router.get("/registrant/:id", registrantController.getById);
router.post("/registrant", registrantController.add);
router.put("/registrant/:id", registrantController.update);
router.delete("/registrant/:id", registrantController.delete);
//router.get('/aktifregistrant', registrantController.listRegistrantAktif);

router.get('/biayatahunanbylembagaandperiode/:id_lembaga/:periode', biayatahunanController.getByLembagaAndPeriode);
router.get('/biayatahunan/:id', biayatahunanController.getById);
router.get('/biayatahunanbygroup/:id/:groupid', biayatahunanController.getBiayaTahunanByGroup);
router.post('/biayatahunan', biayatahunanController.add);
router.post('/biayatahunan/additem', biayatahunanController.addItem);
router.delete('/biayatahunan/deleteitem/:id', biayatahunanController.deleteItemBiaya);


/* Pembayaran Router */
router.post(
  "/createmanualbiayaformulir",
  pembayaranController.makeManualBiayaFormulir
);
router.post(
  "/getTagihanFormulir",
  pembayaranController.getTagihanFormulirByStudent
);
router.post("/getAllTagihanBulanan", pembayaranController.getAllTagihanBulanan);
router.post(
  "/getDetailTagihanBulananSiswa",
  pembayaranController.getDetailTagihanBulananSiswa
);
router.post(
  "/getAllUnpaidTagihanByGroupBiaya",
  pembayaranController.getAllUnpaidTagihanByGroupBiaya
);
router.post(
  "/getAllUnpaidTagihanByGroupBiayaPerItem",
  pembayaranController.getAllUnpaidTagihanByGroupBiayaPerItem
);
router.post("/getLaporanTagihan", pembayaranController.getLaporanTagihan);
router.post(
  "/generateTagihanBulanan",
  pembayaranController.generateTagihanBulanan
);
router.post("/deleteTagihanBulanan", pembayaranController.deleteTagihanBulanan);
router.post("/checkStatusVa", pembayaranController.checkStatusVa);
router.post("/makePembayaran", pembayaranController.makePembayaran);
router.get(
  "/getAllPembayaranFormulir",
  pembayaranController.getAllPembayaranFormulir
);

/* setting inysa daily */
router.get("/settinginsyadaily", settinginsyadailyController.list);
router.get("/settinginsyadaily/:id", settinginsyadailyController.getById);
router.post("/settinginsyadaily", settinginsyadailyController.add);
router.post("/settinginsyadailybytipe", settinginsyadailyController.getByTipe);
router.put("/settinginsyadaily/:id", settinginsyadailyController.update);
router.delete("/settinginsyadaily/:id", settinginsyadailyController.delete);

module.exports = router;
