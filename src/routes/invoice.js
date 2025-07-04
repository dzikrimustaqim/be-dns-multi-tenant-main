const express = require("express");
const invoiceController = require("../controllers").invoice;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

/* Invoice Router */
router.post("/", invoiceController.add);
router.post("/invoiceIsExist", invoiceController.getExistingInvoice);
router.post("/updateinvoicestatus", invoiceController.updateInvoiceStatus);

module.exports = router;
