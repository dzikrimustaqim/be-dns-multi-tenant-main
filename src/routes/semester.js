const express = require("express");
const semesterController = require("../controllers/semester");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", semesterController.list);
router.get("/:id", semesterController.getById);
router.post("/", semesterController.add);
router.post("/init", semesterController.addInitSemester);
router.post("/getActif", semesterController.getSemesterAktif);
router.post("/getByPeriode", semesterController.listSemesterByPeriode);
router.put("/:id", semesterController.update);
router.delete("/:id", semesterController.delete);

module.exports = router;
