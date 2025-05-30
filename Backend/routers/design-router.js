const express = require("express");
const router = express.Router();
const designController = require("../controllers/design-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");

router.route("/add").post(authMiddleware, authorizeAdmin, designController.add);

router.route("/get").get(authMiddleware, authorizeAdmin, designController.getDesigns);

router.route("/delete").delete(authMiddleware, authorizeAdmin, designController.deleteDesign);

router.route("/update").patch(authMiddleware, authorizeAdmin, designController.updateDesign);

module.exports = router;