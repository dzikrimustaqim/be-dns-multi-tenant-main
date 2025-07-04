const express = require("express");
const templateController = require("../controllers/template");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", templateController.list);
router.get("/:id", templateController.getById);
router.get(
  "/templatesettingbytemplate/:template",
  templateController.getByTemplate
);
router.post("/", templateController.add);
router.put("/:id", templateController.update);
router.delete("/:id", templateController.delete);

module.exports = router;
