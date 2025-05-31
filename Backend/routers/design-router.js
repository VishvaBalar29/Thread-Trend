const express = require("express");
const router = express.Router();
const designController = require("../controllers/design-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");
const upload = require("../middlewares/upload")

router.route("/add").post(authMiddleware, authorizeAdmin, upload.single("image"), designController.add);

router.route("/get").get(authMiddleware, designController.getDesigns);

router.route("/delete").delete(authMiddleware, authorizeAdmin, designController.deleteDesign);

router.route("/update").patch(authMiddleware, authorizeAdmin, upload.single("image"), designController.updateDesign);

router.route("/get").get(authMiddleware, designController.getDesignById);

module.exports = router;