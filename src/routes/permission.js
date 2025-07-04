const express = require("express");
const permissionController = require("../controllers/permission");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// Semua rute membutuhkan autentikasi
router.use(authenticate);

router.get("/", permissionController.list);
router.get("/permissionrole/:id", permissionController.listRolePermission);
router.get("/:id", permissionController.getById);
router.post("/", permissionController.add);
router.put("/:id", permissionController.update);
router.delete("/:id", permissionController.delete);

module.exports = router;
