const express = require("express");
const dokumenController = require("../controllers/dokumen");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", dokumenController.list);
router.get("/:id", dokumenController.getById);
router.post("/", dokumenController.add);
router.put("/:id", dokumenController.update);
router.delete("/:id", dokumenController.delete);

module.exports = router;
