const express = require("express");
const chartmasterController = require("../controllers/chartmaster");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", chartmasterController.list);
router.post("/", chartmasterController.add);

module.exports = router;
