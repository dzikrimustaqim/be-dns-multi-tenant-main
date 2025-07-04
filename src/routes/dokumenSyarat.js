const express = require("express");
const dokumeSyaratController = require("../controllers/dokumensyarat");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", dokumeSyaratController.list);
router.get("/:id", dokumeSyaratController.getById);
router.get("/dokumenbysiswa/:id", dokumeSyaratController.getBySiswa);
router.post("/", dokumeSyaratController.add);
router.put("/:id", dokumeSyaratController.update);
router.delete("/:id", dokumeSyaratController.delete);

module.exports = router;
