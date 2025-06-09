const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");


router.route("/add").post(authMiddleware, authorizeAdmin, orderController.add);

router.route("/delete/:id").delete(authMiddleware, authorizeAdmin, orderController.deleteOrder);

router.route("/get/:id").get(orderController.getOrder);

router.route("/getByCustId/:custId").get(authMiddleware, orderController.getOrderByCustomerId);

router.route("/update/:orderId").patch(authMiddleware, authorizeAdmin, orderController.updateOrder);

module.exports = router;