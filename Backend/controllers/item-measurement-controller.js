const Measurement = require("../models/measurement-model");
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
        if (!itemExist) return sendResponse(res, 400, {}, "Given Item ID is not exist");

        const keyExist = await Measurement.findById(key_id);
        if (!keyExist) return sendResponse(res, 400, {}, "Given Key ID is not exist");

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

const getMeasurements = async (req, res) => {
    try {
        const measurements = await ItemMeasurement.find().populate("key_id").populate("item_id");
        return sendResponse(res, 200, { measurements }, "All item measurements fetched successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `getMeasurements controller error : ${e}`);
    }
}

const getMeasurementByItemId = async (req, res) => {
    try {
        const itemid = req.params.itemId;
        const itemExist = await Item.findById(itemid).populate('order_id');

        if (
            itemExist.order_id.customer_id.toString() !== req.user.customerId &&
            !req.user.is_admin
        ) {
            return sendResponse(res, 403, {}, "You are not authorized to access this item");
        }


        if (!itemid) {
            return sendResponse(res, 400, {}, "Item ID is required");
        }
        if (!itemExist) { return sendResponse(res, 400, {}, "Given Item ID is not exist"); }

        const measurements = await ItemMeasurement.find({ item_id: itemid }).populate("key_id");
        return sendResponse(res, 200, { measurements }, "Measurements for given item fetched successfully");

    }
    catch (e) {
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

const saveAllMeasurements = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { item_id, measurements } = req.body;
        if (!item_id || !measurements || !Array.isArray(measurements)) {
            return sendResponse(res, 400, {}, "Invalid data structure");
        }

        const item = await Item.findById(item_id).session(session);
        if (!item) {
            throw new Error("Item does not exist");
        }

        const resultMeasurements = [];

        for (const entry of measurements) {
            let { key_name, value, key_id } = entry;

            if (!value || (!key_id && !key_name)) {
                throw new Error("Invalid measurement entry: key_id or key_name and value are required");
            }

            // Step 1: If key_id not provided, create new key
            if (!key_id && key_name) {
                key_name = key_name.toLowerCase();
                const existingKey = await Measurement.findOne({ key_name }).session(session);
                if (existingKey) {
                    throw new Error(`Key "${key_name}" already exists`);
                }

                const newKey = await Measurement.create([{ key_name }], { session });
                key_id = newKey[0]._id;
            }

            // Step 2: Check duplicate measurement
            const exists = await ItemMeasurement.findOne({ item_id, key_id }).session(session);
            if (exists) {
                throw new Error(`Measurement already exists for key ID: ${key_id}`);
            }

            // Step 3: Save measurement
            const saved = await ItemMeasurement.create([{
                item_id,
                key_id,
                value
            }], { session });

            resultMeasurements.push(saved[0]);
        }

        await session.commitTransaction();
        session.endSession();

        return sendResponse(res, 200, { resultMeasurements }, "All measurements saved successfully");
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        return sendResponse(res, 400, {}, `Transaction failed: ${e.message}`);
    }
};




module.exports = { add, getMeasurements, getMeasurementByItemId, deleteMeasurement, updateMeasurement, saveAllMeasurements };