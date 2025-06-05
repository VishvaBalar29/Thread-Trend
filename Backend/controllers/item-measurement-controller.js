const Measurement = require("../models/measurement-model");
const DefaultMeasurement = require("../models/default-measurement-model");
const ItemMeasurement = require("../models/item-measurement-model");
const Item = require("../models/item-model");
const sendResponse = require("../utils/response-handler");
const mongoose = require("mongoose");

const add = async (req, res) => {
    try {
        let { item_id, key_id, value } = req.body;

        if (!item_id || !key_id || !value) {
            return sendResponse(res, 400, {}, "item_id, key_id, and value are required");
        }

        const itemExist = await Item.findById(item_id);
        if(!itemExist)  return sendResponse(res, 400, {}, "Given Item ID is not exist");

        const keyExist = await Measurement.findById(key_id);
        if(!keyExist)  return sendResponse(res, 400, {}, "Given Key ID is not exist");

        const exist = await ItemMeasurement.findOne({ item_id, key_id });
        if (exist) {
            return sendResponse(res, 400, {}, "Measurement already exists for this item and key");
        }

        const measurement = await ItemMeasurement.create({ item_id, key_id, value });
        return sendResponse(res, 200, { measurement }, "Measurement added successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `add item-measurement controller error : ${e}`);
    }
    
}

const getMeasurements = async (req,res) => {
    try {
        const measurements = await ItemMeasurement.find().populate("key_id").populate("item_id");
        return sendResponse(res, 200, { measurements }, "All item measurements fetched successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `getMeasurements controller error : ${e}`);
    }
}

const getMeasurementByItemId = async (req,res) => {
    try {
        const id = req.params.itemId;
        if (!id) {
            return sendResponse(res, 400, {}, "Item ID is required");
        }
        const itemExist = await Item.findById(id);
        if(!itemExist)  return sendResponse(res, 400, {}, "Given Item ID is not exist");
        const measurements = await ItemMeasurement.find({ item_id: id }).populate("key_id");
        return sendResponse(res, 200, { measurements }, "Measurements for given item fetched successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `getMeasurementById controller error : ${e}`);
    }
}

const deleteMeasurement = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return sendResponse(res, 400, {}, "ID is required");
        }

        const exist = await ItemMeasurement.findById(id);
        if (!exist) {
            return sendResponse(res, 404, {}, "Measurement not found");
        }

        await ItemMeasurement.findByIdAndDelete(id);
        return sendResponse(res, 200, {}, "Measurement deleted successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `deleteMeasurement controller error : ${e}`);
    }
};

const updateMeasurement = async (req, res) => {
    try {
        const id = req.params.id;
        const { value } = req.body;

        if (!id || !value) {
            return sendResponse(res, 400, {}, "ID and value are required");
        }

        const updated = await ItemMeasurement.findByIdAndUpdate(id, { value }, { new: true });
        if (!updated) {
            return sendResponse(res, 404, {}, "Measurement not found");
        }

        return sendResponse(res, 200, { updated }, "Measurement updated successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `updateMeasurement controller error : ${e}`);
    }
};



module.exports = {add, getMeasurements, getMeasurementByItemId, deleteMeasurement, updateMeasurement };