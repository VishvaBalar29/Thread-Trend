const express = require("express");
const router = express.Router();
const ItemMeasurementController = require("../controllers/item-measurement-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");
const Item = require("../models/item-model");

router.route("/add").post(authMiddleware, authorizeAdmin, ItemMeasurementController.add);

router.route("/get").get(authMiddleware, authorizeAdmin, ItemMeasurementController.getMeasurements);

router.route("/get/:itemId").get(authMiddleware, ItemMeasurementController.getMeasurementByItemId);

router.route("/delete/:id").delete(authMiddleware, authorizeAdmin, ItemMeasurementController.deleteMeasurement);

router.route("/update/:id").patch(authMiddleware, authorizeAdmin, ItemMeasurementController.updateMeasurement);

router.route("/save-all-measurements").post(authMiddleware, authorizeAdmin, ItemMeasurementController.saveAllMeasurements);

module.exports = router;