const Category = require("../models/category-model");
const sendResponse = require("../utils/response-handler");


const add = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name == "") {
            return sendResponse(res, 400, {}, "Please Enter Category Name");
        }

        // check if category is already exist 
        const existCat = await Category.findOne({ name });
        if (existCat) {
            return sendResponse(res, 400, {}, "Category is already exist");
        }

        const category = await Category.create({ name });
        if (category) {
            return sendResponse(res, 200, { category }, "Category Added Successfully");
        }
        else {
            return sendResponse(res, 200, {}, "Category can't added");
        }
    } catch (error) {
        return sendResponse(res, 400, {}, `add category controller error ${e}`);
    }

}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return sendResponse(res, 200, { categories }, "Categories fetched")
    } catch (e) {
        return sendResponse(res, 400, {}, `get category controller error : ${e}`);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return sendResponse(res, 400, {}, "Category ID is required");
        }
        const categoryExist = await Category.findOne({ _id: id });
        if (!categoryExist) {
            return sendResponse(res, 400, {}, "Given Category ID is not found");
        }
        await Category.deleteOne({ _id: id });
        return sendResponse(res, 200, {}, "Deleted Suceessfully");
    } catch (error) {
        return sendResponse(res, 400, {}, `delete category controller error ${e}`);
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.query.id;
        const { name } = req.body;
        if (!id) {
            return sendResponse(res, 400, {}, "Customer ID is required");
        }
        if (!name || name == "") {
            return sendResponse(res, 400, {}, "Please Enter Category Name");
        }
        const categoryExist = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!categoryExist) {
            return sendResponse(res, 404, {}, "Given Category ID is not found");
        }
        return sendResponse(res, 200, { categoryExist }, "Category updated successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `Update category controller error ${e}`)
    }
}

const getCategoryByName = async (req, res) => {
    try {
        const name = req.query.name;
        if (!name) {
            return sendResponse(res, 400, {}, "Category name is required");
        }
        const categoryExist = await Category.findOne({ name });
        if (!categoryExist) {
            return sendResponse(res, 400, {}, "Given Category name is not found");
        }
        return sendResponse(res, 200, {category : categoryExist}, "Fetched Suceessfully");
    } catch (error) {
        return sendResponse(res, 400, {}, `getCategoryById controller error ${e}`);
    }
}



module.exports = { add, getCategories, deleteCategory, updateCategory, getCategoryByName };