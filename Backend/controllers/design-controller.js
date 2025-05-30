const Design = require("../models/design-model");
const Category = require("../models/category-model");
const sendResponse = require("../utils/response-handler");

const add = async (req, res) => {
    try {
        const { category_id, title, description, image } = req.body;

        if (!category_id || !title || !image) {
            return sendResponse(res, 400, {}, "Required fields: category_id, title, and image");
        }

        if (category_id == "" || title == "" || image == "") {
            return sendResponse(res, 400, {}, "Required fields: category_id, title, and image");
        }

        const categoryExist = await Category.findById(category_id);
        if (!categoryExist) {
            return sendResponse(res, 400, {}, "Given Category Id is not Exist");
        }

        const design = await Design.create({ category_id, title, description, image });

        return sendResponse(res, 200, { design }, "Design Added Successfully");

    } catch (e) {
        return sendResponse(res, 400, {}, `Design add controller error : ${e}`);
    }
}

const getDesigns = async (req, res) => {
    try {
        const designs = await Design.find().populate('category_id', 'name');
        if (!designs) {
            return sendResponse(res, 400, {}, "Designs not found");
        }
        return sendResponse(res, 200, { designs }, "Designs Fetched");
    } catch (error) {
        return sendResponse(res, 400, {}, `view design controller error : ${e}`);
    }
}

const deleteDesign = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return sendResponse(res, 400, {}, "Design ID is Required");
        }
        const design = await Design.findByIdAndDelete(id);
        if (!design) {
            return sendResponse(res, 404, {}, "Given Design ID is not found");
        }
        return sendResponse(res, 200, {}, "Deleted Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `delete design controller error ${e}`);
    }
}

const updateDesign = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return sendResponse(res, 400, {}, "Design ID is Required");
        }
        const {category_id, title, description, image} = req.body;

        if (!category_id || !title || !image) {
            return sendResponse(res, 400, {}, "Required fields: category_id, title, and image");
        }
        if (category_id == "" || title == "" || image == "") {
            return sendResponse(res, 400, {}, "Required fields: category_id, title, and image");
        }

        const categoryExist = await Category.findById(category_id);
        if (!categoryExist) {
            return sendResponse(res, 400, {}, "Given Category Id is not Exist");
        }
        const designExist = await Design.findByIdAndUpdate(id, req.body, {new:true});

        if (!designExist) {
            return sendResponse(res, 404, {}, "Given Design ID is not found");
        }
        return sendResponse(res, 200, {designExist}, "Design updated successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `Update design controller error ${e}`);
    }
}


module.exports = { add, getDesigns, deleteDesign, updateDesign };