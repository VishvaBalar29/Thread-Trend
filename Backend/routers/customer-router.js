const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer-controller");

router.route("/add").post(customerController.addCustomer);

router.route("/login").get(customerController.login);

router.route("/get").get(customerController.getAllCustomer);

router.route("/get-customer").get(customerController.getCustomerById);

router.route("/delete").delete(customerController.deleteCustomer);

router.route("/update").patch(customerController.updateCustomer);

router.route("/update-password").patch(customerController.updatePassword);

router.route("/request-forgot-password").post(customerController.requestForForgotPassword);

router.route("/forgot-password").post(customerController.forgotPassword);

module.exports = router;