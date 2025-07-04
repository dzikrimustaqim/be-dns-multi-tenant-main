const express = require("express");
const logController = require("../controllers/log");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", logController.list);
router.get("/:id", logController.getById);
router.post("/", logController.add);
router.put("/:id", logController.update);
router.delete("/:id", logController.delete);

module.exports = router;
