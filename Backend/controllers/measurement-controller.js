const Measurement = require("../models/measurement-model");
const DefaultMeasurement = require("../models/default-measurement-model");
const ItemMeasurement = require("../models/item-measurement-model");
const sendResponse = require("../utils/response-handler");
const mongoose = require("mongoose");


const add = async (req, res) => {
    try {
        let { key_name } = req.body;
        if (!key_name || key_name == "") {
            return sendResponse(res, 400, {}, `Key name is Required`);
        }
        key_name = key_name.toLowerCase();
        const keyExist = await Measurement.findOne({ key_name });
        if (keyExist) {
            return sendResponse(res, 400, {}, `Key is already exist`);
        }
        const measurement = await Measurement.create({
            key_name
        })
        return sendResponse(res, 200, { measurement }, `Key name is registered successfully`);
    } catch (e) {
        return sendResponse(res, 400, {}, `add key controller error : ${e}`);
    }
}

const getMeasurements = async (req, res) => {
    try {
        const measurements = await Measurement.find({});
        if (!measurements) {
            return sendResponse(res, 400, {}, `Measurements not found`);
        }
        return sendResponse(res, 200, { measurements }, `Measurements Fetched`);
    } catch (e) {
        return sendResponse(res, 400, {}, `getMeasurements controller error : ${e}`);
    }
}

const getMeasurementById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || id == "") {
            return sendResponse(res, 400, {}, `Please enter the valid Key ID`);
        }
        const key = await Measurement.findOne({ _id: id });
        if (!key) {
            return sendResponse(res, 400, {}, `Given Key ID is not exist`);
        }
        return sendResponse(res, 200, { key }, `Measurement Fetched`);
    } catch (e) {
        return sendResponse(res, 400, {}, `getMeasurementById controller error : ${e}`);
    }
}

const deleteMeasurement = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, {}, `Invalid Measurement ID`);
        }

        const measurement = await Measurement.findById(id);
        if (!measurement) {
            return sendResponse(res, 404, {}, `Measurement not found`);
        }

        const isInCategoryDefault = await DefaultMeasurement.findOne({ key_id: id });

        const isInItemMeasurement = await ItemMeasurement.findOne({ key_id: id });

        if (isInCategoryDefault || isInItemMeasurement) {
            return sendResponse(res, 400, {}, `Cannot delete: This measurement is being used in category or item measurements. Please remove those first.`);
        }

        await Measurement.findByIdAndDelete(id);

        return sendResponse(res, 200, {}, `Measurement deleted successfully`);
    } catch (error) {
        return sendResponse(res, 500, {}, `deleteMeasurement controller error: ${error.message}`);
    }
};

const updateMeasurement = async (req, res) => {
    try {
        const id = req.params.id;
        let { key_name } = req.body;

        if (!id || id.trim() === "") {
            return sendResponse(res, 400, {}, `Please enter a valid Key ID`);
        }

        if (!key_name || key_name.trim() === "") {
            return sendResponse(res, 400, {}, `Key name is required`);
        }

        key_name = key_name.toLowerCase();

        const existing = await Measurement.findOne({ key_name });
        if (existing && existing._id.toString() !== id) {
            return sendResponse(res, 400, {}, `Another measurement with the same key name already exists`);
        }

        const updated = await Measurement.findByIdAndUpdate(
            id,
            { key_name },
            { new: true }
        );

        if (!updated) {
            return sendResponse(res, 404, {}, `Measurement not found`);
        }

        return sendResponse(res, 200, { measurement: updated }, `Measurement updated successfully`);
    } catch (error) {
        return sendResponse(res, 500, {}, `updateMeasurement controller error: ${error.message}`);
    }
};

const getNonDefaultMeasurement = async (req, res) => {
    try {
        const defaultKeys = await DefaultMeasurement.find({}, 'key_id');
        const keyIds = defaultKeys.map(dm => dm.key_id);

        const measurements = await Measurement.find({ _id: { $nin: keyIds } });

       if (!measurements || measurements.length === 0) {
            return sendResponse(res, 404, {}, 'No non-default measurements found');
        }

        return sendResponse(res, 200, { measurements }, 'Non-default measurements fetched');
    } catch (e) {
        return sendResponse(res, 400, {}, `getNonDefaultMeasurement controller error : ${e}`);
    }
}



module.exports = { add, getMeasurements, getMeasurementById, deleteMeasurement, updateMeasurement, getNonDefaultMeasurement };