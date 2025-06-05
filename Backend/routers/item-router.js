const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item-controller");
const { authMiddleware, authorizeAdmin } = require("../middlewares/auth-middleware");

router.route("/add").post(authMiddleware, authorizeAdmin, itemController.add);

router.route("/get/:id").get(authMiddleware, itemController.getItem);

router.route("/get/order/:id").get(authMiddleware, itemController.getItemsByOrderId);

router.route("/delete/:id").delete(authMiddleware, authorizeAdmin, itemController.deleteItem);

router.route("/update/:id").patch(authMiddleware, authorizeAdmin, itemController.updateItem);

module.exports = router;