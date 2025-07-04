const express = require("express");
const matapelujiController = require("../controllers/matapeluji");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", matapelujiController.list);
router.get("/:id", matapelujiController.getById);
router.post("/", matapelujiController.add);
router.put("/:id", matapelujiController.update);
router.delete("/:id", matapelujiController.delete);

module.exports = router;
