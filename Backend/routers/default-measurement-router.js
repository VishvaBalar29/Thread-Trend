const express = require("express");
const router = express.Router();
const DefaultMeasurementController = require("../controllers/default-measurement-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");

router.route("/add").post(authMiddleware, authorizeAdmin, DefaultMeasurementController.add);

router.route("/get").get(authMiddleware, authorizeAdmin, DefaultMeasurementController.getMeasurements);

router.route("/get/:CatId").get(authMiddleware, authorizeAdmin, DefaultMeasurementController.getMeasurementByCatId);

router.route("/delete/:id").delete(authMiddleware, authorizeAdmin, DefaultMeasurementController.deleteMeasurement);

router.route("/update/:id").patch(authMiddleware, authorizeAdmin, DefaultMeasurementController.updateMeasurement);


module.exports = router;