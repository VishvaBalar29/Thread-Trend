const DefaultMeasurement = require("../models/default-measurement-model");
const Measurement = require("../models/measurement-model");
const Category = require("../models/category-model");
const sendResponse = require("../utils/response-handler");

const add = async (req, res) => {
    try {
        const { category_id, key_id } = req.body;

        if (!category_id || !key_id) {
            return sendResponse(res, 400, {}, "category_id and key_id are required");
        }

        const categoryExists = await Category.findById(category_id);
        const measurementExists = await Measurement.findById(key_id);

        if (!categoryExists || !measurementExists) {
            return sendResponse(res, 404, {}, "Category or Measurement not found");
        }

        const alreadyExists = await DefaultMeasurement.findOne({ category_id, key_id });
        if (alreadyExists) {
            return sendResponse(res, 400, {}, "This default measurement already exists");
        }

        const defaultMeasurement = await DefaultMeasurement.create({ category_id, key_id });
        return sendResponse(res, 200, { defaultMeasurement }, "Default measurement added successfully");
    } catch (e) {
        return sendResponse(res, 500, {}, `add defaule measurement controller error: ${e.message}`);
    }
}

const getMeasurements = async (req, res) => {
    try {
        const measurements = await DefaultMeasurement.find()
            .populate('category_id', 'name') 
            .populate('key_id', 'key_name');     

        const grouped = {};

        measurements.forEach(m => {
            const catName = m.category_id.name;
            if (!grouped[catName]) grouped[catName] = [];

            grouped[catName].push({
                _id: m._id,
                key_id: m.key_id._id,
                key_name: m.key_id.key_name,
            });
        });

        const result = Object.entries(grouped).map(([categoryName, measurements]) => ({
            categoryName,
            measurements,
        }));

        return sendResponse(res, 200, {result} , "Fetched Successfully");
    } catch (e) {
        console.error('Error:', e);
        return sendResponse(res, 500, {}, `get default measurements controller error : ${e}`)
    }
}

const getMeasurementByCatId = async (req, res) => {
    try {
        const { CatId } = req.params;
        if (!CatId) {
            return sendResponse(res, 400, {}, "Category ID is required");
        }
        const categoryExist = await Category.findById(CatId);
        if (!categoryExist) return sendResponse(res, 400, {}, "Given category ID is not valid");
        const measurementExist = await DefaultMeasurement.find({ category_id: CatId });
        if (measurementExist.length == 0) {
            return sendResponse(res, 400, {}, "Measurements not found");
        }
        const measurements = await DefaultMeasurement.find({ category_id: CatId }).populate("key_id");

        return sendResponse(res, 200, { measurements }, "Measurements by category fetched");
    } catch (e) {
        return sendResponse(res, 500, {}, `getMeasurementByCatId controller error: ${e.message}`);
    }
}

const deleteMeasurement = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return sendResponse(res, 400, {}, "Default Measurement ID is required");
        }
        const deleted = await DefaultMeasurement.findByIdAndDelete(id);
        if (!deleted) {
            return sendResponse(res, 404, {}, "Default Measurement not found");
        }

        // const exist 
        return sendResponse(res, 200, {}, "Default Measurement deleted successfully");
    } catch (e) {
        return sendResponse(res, 500, {}, `deleteMeasurement controller error: ${e.message}`);
    }
};

const updateMeasurement = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, key_id } = req.body;

        if (!category_id || !key_id) {
            return sendResponse(res, 400, {}, "category_id and key_id are required");
        }

        const categoryExists = await Category.findById(category_id);
        const measurementExists = await Measurement.findById(key_id);

        if (!categoryExists || !measurementExists) {
            return sendResponse(res, 404, {}, "Category or Measurement not found");
        }

        const exists = await DefaultMeasurement.findById(id);
        if (!exists) {
            return sendResponse(res, 404, {}, "Default Measurement not found");
        }

        exists.category_id = category_id;
        exists.key_id = key_id;
        await exists.save();
        return sendResponse(res, 200, { updated: exists }, "Default Measurement updated successfully");
    } catch (e) {
        return sendResponse(res, 500, {}, `updateMeasurement controller error: ${e.message}`);
    }
};



module.exports = { add, getMeasurements, getMeasurementByCatId, deleteMeasurement, updateMeasurement };

