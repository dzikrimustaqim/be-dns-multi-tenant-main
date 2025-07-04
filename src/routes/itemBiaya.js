const express = require("express");
const itembiayaController = require("../controllers").itembiaya;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

/* Item Biaya Router */
router.get("/itembiaya", itembiayaController.list);
router.post("/itembiaya", itembiayaController.add);
router.put("/itembiaya/:id", itembiayaController.update);

module.exports = router;
