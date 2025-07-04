const express = require("express");
const izinmengajarController = require("../controllers/izinmengajar");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", izinmengajarController.list);
router.get("/:id", izinmengajarController.getById);
router.post("/", izinmengajarController.add);
router.post(
  "/izinmengajargetgurupengganti",
  izinmengajarController.getGuruPengganti
);
router.put("/:id", izinmengajarController.update);
router.put("/izinmengajarapproval/:id", izinmengajarController.updateApproval);
router.put(
  "/izinmengajargurupengganti/:id",
  izinmengajarController.updateGuruPengganti
);
router.delete("/:id", izinmengajarController.delete);

module.exports = router;
