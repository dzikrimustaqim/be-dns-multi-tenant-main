const express = require("express");
const biayakhususController = require("../controllers").biayakhusus;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

/* Biaya Khusus router */
router.get("/", biayakhususController.list);
router.get("/:id", biayakhususController.getById);
router.get("/biayakhususGetBySiswa/:id", biayakhususController.getBySiswaId);
router.post("/", biayakhususController.add);
router.put("/:id", biayakhususController.update);
router.put("/biayakhususSetActive/:id", biayakhususController.setActive);
router.delete("/:id", biayakhususController.delete);

router.post("/biayakhususAddItemBiaya", biayakhususController.addItemBiaya);
router.get(
  "/biayakhususGetListItemBiaya/:id",
  biayakhususController.listItemBiaya
);
router.delete(
  "/biayakhususItemBiaya/:id",
  biayakhususController.deleteItemBiaya
);

module.exports = router;
