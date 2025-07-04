const express = require("express");
const liburMengajarController = require("../controllers/liburmengajar");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", liburMengajarController.list);
router.get("/:id", liburMengajarController.getById);
router.post("/", liburMengajarController.add);
router.put("/:id", liburMengajarController.update);
router.delete("/:id", liburMengajarController.delete);

module.exports = router;
