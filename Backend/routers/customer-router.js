const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer-controller");
const {authMiddleware, authorizeAdmin, preventLoggedInAccess, checkLogout} = require("../middlewares/auth-middleware");
const validateMiddleware = require("../middlewares/validate-middleware");
const {registerSchema, loginSchema} = require("../validators/auth-validator");



router.route("/add").post(authMiddleware, authorizeAdmin, validateMiddleware(registerSchema), customerController.addCustomer);

router.route("/login").post(preventLoggedInAccess, validateMiddleware(loginSchema), customerController.login);

router.route("/get").get(authMiddleware, authorizeAdmin, customerController.getAllCustomer);

router.route("/get-customer").get(authMiddleware, authorizeAdmin, customerController.getCustomerById);

router.route("/delete").delete(authMiddleware, authorizeAdmin, customerController.deleteCustomer);

router.route("/update").patch(authMiddleware, customerController.updateCustomer);

router.route("/update-password").patch(authMiddleware, customerController.updatePassword);

router.route("/request-forgot-password").post(authMiddleware, customerController.requestForForgotPassword);

router.route("/forgot-password").post(authMiddleware, customerController.forgotPassword);

router.route("/logout").post(checkLogout, customerController.logout);

module.exports = router;