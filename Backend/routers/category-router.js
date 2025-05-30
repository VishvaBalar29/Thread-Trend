const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category-controller");
const {authMiddleware, authorizeAdmin} = require("../middlewares/auth-middleware");

router.route("/add").post(authMiddleware, authorizeAdmin, categoryController.add);

router.route("/get").get(authMiddleware, authorizeAdmin, categoryController.getCategories);

router.route("/delete").delete(authMiddleware, authorizeAdmin, categoryController.deleteCategory);

router.route("/update").patch(authMiddleware, authorizeAdmin, categoryController.updateCategory);

module.exports = router;