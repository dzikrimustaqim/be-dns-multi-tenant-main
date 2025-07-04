const express = require("express");
const jadwalpelajaranController = require("../controllers/jadwalpelajaran");
var multer = require("multer");
const uploadMem = multer({ storage: multer.memoryStorage() });
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", jadwalpelajaranController.list);
router.get("/:id", jadwalpelajaranController.getById);
router.post("/", jadwalpelajaranController.add);
router.post(
  "/uploadjadwalpelajaran",
  uploadMem.single("file"),
  jadwalpelajaranController.upload
);
router.post(
  "/getByPeriodeSemester",
  jadwalpelajaranController.getByPeriodeSemester
);
router.post(
  "/getByPeriodeSemesterAndGuru",
  jadwalpelajaranController.getByPeriodeSemesterAndGuru
);
router.post(
  "/getListMataPelajaranByPeriodeSemesterAndGuru",
  jadwalpelajaranController.getListMatapelajaranByPeriodeSemesterAndGuru
);
router.post(
  "/getByPeriodeSemesterAndDay",
  jadwalpelajaranController.getByPeriodeSemesterAndDay
);
router.post("/getDayPeriod", jadwalpelajaranController.getDayPeriod);
router.post(
  "/getSingleDataByPeriodOfLesson",
  jadwalpelajaranController.getSingleDataByPeriodOfLesson
);
router.put("/:id", jadwalpelajaranController.update);
router.delete("/:id", jadwalpelajaranController.delete);

module.exports = router;
