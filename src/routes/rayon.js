const express = require("express");
const rayonController = require("../controllers/rayon");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", rayonController.list);
router.get("/:id", rayonController.getById);
router.get("/rayonbygedung/:id", rayonController.getByGedung);
router.post("/", rayonController.add);
router.put("/:id", rayonController.update);
router.delete("/:id", rayonController.delete);

module.exports = router;
