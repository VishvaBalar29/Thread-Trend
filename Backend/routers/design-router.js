const express = require("express");
const router = express.Router();
const designController = require("../controllers/design-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");
const { uploadDesign, uploadItem } = require("../middlewares/upload")

router.route("/add").post(authMiddleware, authorizeAdmin, uploadDesign.single("image"), designController.add);

router.route("/get").get(designController.getDesigns);

router.route("/delete").delete(authMiddleware, authorizeAdmin, designController.deleteDesign);

router.route("/update").patch(authMiddleware, authorizeAdmin, uploadDesign.single("image"), designController.updateDesign);

router.route("/get/:id").get(designController.getDesignById);

module.exports = router;