const express = require("express");
const kelasController = require("../controllers").kelas;
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", kelasController.list);
router.get("/:id", kelasController.getById);
router.post("/", kelasController.add);
router.put("/:id", kelasController.update);
router.delete("/:id", kelasController.delete);

module.exports = router;
