const express = require("express");
const contentregisController = require("../controllers").contentregis;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

/* Content Regis */
router.get("/contentregisGetByType/:type", contentregisController.getByType);
router.post("/", contentregisController.add);
router.put("/:id", contentregisController.update);

module.exports = router;
