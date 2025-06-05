const express = require("express");
const router = express.Router();
const ItemMeasurementController = require("../controllers/item-measurement-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");

router.route("/add").post(authMiddleware, authorizeAdmin, ItemMeasurementController.add);

router.route("/get").get(authMiddleware, authorizeAdmin, ItemMeasurementController.getMeasurements);

router.route("/get/:itemId").get(authMiddleware, authorizeAdmin, ItemMeasurementController.getMeasurementByItemId);

router.route("/delete/:id").delete(authMiddleware, authorizeAdmin, ItemMeasurementController.deleteMeasurement);

router.route("/update/:id").patch(authMiddleware, authorizeAdmin, ItemMeasurementController.updateMeasurement);


module.exports = router;