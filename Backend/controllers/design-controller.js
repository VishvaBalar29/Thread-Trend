const Design = require("../models/design-model");
const Category = require("../models/category-model");
const sendResponse = require("../utils/response-handler");

const fs = require("fs");
const path = require("path");

const add = async (req, res) => {
  try {
    const { category_id, title, description } = req.body;
    const image = req.file ? req.file.filename : null; // only file name

    if (!category_id || !title || !image) {
      return sendResponse(res, 400, {}, "Required fields: category_id, title, and image");
    }

    const categoryExist = await Category.findById(category_id);
    if (!categoryExist) {
      return sendResponse(res, 400, {}, "Given Category Id does not exist");
    }

    const design = await Design.create({ category_id, title, description, image });

    return sendResponse(res, 200, { design }, "Design Added Successfully");
  } catch (e) {
    return sendResponse(res, 400, {}, `Design add controller error: ${e.message}`);
  }
};


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
        if (!id) return sendResponse(res, 400, {}, "Design ID is required");

        const { category_id, title, description } = req.body;
        if (!category_id || !title) {
            return sendResponse(res, 400, {}, "Required fields: category_id and title");
        }

        const categoryExist = await Category.findById(category_id);
        if (!categoryExist) return sendResponse(res, 400, {}, "Invalid Category ID");

        const design = await Design.findById(id);
        if (!design) return sendResponse(res, 404, {}, "Design not found");

        // If new image uploaded, delete old one
        if (req.file) {
            const oldImagePath = path.join(__dirname, "..", "uploads", "designs", design.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        const updated = await Design.findByIdAndUpdate(
            id,
            {
                category_id,
                title,
                description,
                image: req.file ? req.file.filename : design.image,
            },
            { new: true }
        );

        return sendResponse(res, 200, { design: updated }, "Design updated successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `Update design error: ${e}`);
    }
};



const getDesignById = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return sendResponse(res, 400, {}, "Design ID is Required");
        }
        const design = await Design.findById(id);
        if (!design) {
            return sendResponse(res, 404, {}, "Given Design ID is not found");
        }
        return sendResponse(res, 200, {design}, "Fetched Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `getDesignById controller error ${e}`);
    }
}

module.exports = { add, getDesigns, deleteDesign, updateDesign, getDesignById };