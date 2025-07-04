const express = require("express");
const gurustudiController = require("../controllers").gurustudi;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", gurustudiController.list);
router.get("/:id", gurustudiController.getById);
router.post("/", gurustudiController.add);
router.post("/getBySemesterActif", gurustudiController.getGurustudiBySemester);
router.put("/:id", gurustudiController.update);
router.delete("/:id", gurustudiController.delete);

module.exports = router;
