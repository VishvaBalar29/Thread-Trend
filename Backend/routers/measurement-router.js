const express = require("express");
const router = express.Router();
const measurementController = require("../controllers/measurement-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");

router.route("/add").post(authMiddleware, authorizeAdmin, measurementController.add);

router.route("/get").get(authMiddleware, authorizeAdmin, measurementController.getMeasurements);

router.route("/non-default").get(authMiddleware, authorizeAdmin, measurementController.getNonDefaultMeasurement);

router.route("/get/:id").get(authMiddleware, authorizeAdmin, measurementController.getMeasurementById);

router.route("/delete/:id").delete(authMiddleware, authorizeAdmin, measurementController.deleteMeasurement);

router.route("/update/:id").patch(authMiddleware, authorizeAdmin, measurementController.updateMeasurement);


module.exports = router;