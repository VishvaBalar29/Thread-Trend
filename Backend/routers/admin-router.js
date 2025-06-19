const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");

router.route("/getAllCounts").get(authMiddleware, authorizeAdmin, adminController.getAllCounts);

module.exports = router;