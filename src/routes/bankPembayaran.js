const express = require("express");
const bankpembayaranController = require("../controllers").bankpembayaran;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

/* BankPembayaran Router */
router.get("/", bankpembayaranController.list);
router.post("/", bankpembayaranController.add);
router.post("/getBankByKode", bankpembayaranController.getByKode);
router.put("/:id", bankpembayaranController.update);
// router.delete('/bank/:id', bankpembayaranController.delete);

module.exports = router;
