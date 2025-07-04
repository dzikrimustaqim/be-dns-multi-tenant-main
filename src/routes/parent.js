const express = require("express");
const parentController = require("../controllers/parent");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", parentController.list);
router.post("/", parentController.add);
router.post("/register", parentController.add);
router.post("/login", parentController.login);
router.post("/getByRole", parentController.listParentByRole);
router.get("/:id", parentController.getById);
router.put("/:id", parentController.update);
router.delete("/:id", parentController.delete);

module.exports = router;
