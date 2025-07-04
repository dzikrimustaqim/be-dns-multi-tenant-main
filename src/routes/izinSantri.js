const express = require("express");
const izinsantriController = require("../controllers/izinsantri");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", izinsantriController.list);
router.get("/:id", izinsantriController.getById);
router.post("/", izinsantriController.add);
router.put("/:id", izinsantriController.update);
router.delete("/:id", izinsantriController.delete);

module.exports = router;
