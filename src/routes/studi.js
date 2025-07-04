const express = require("express");
const studiController = require("../controllers/studi");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", studiController.list);
router.get("/:id", studiController.getById);
router.post("/", studiController.add);
router.put("/:id", studiController.update);
router.delete("/:id", studiController.delete);

module.exports = router;
