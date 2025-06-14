const mongoose = require("mongoose");

const Item = require("../models/item-model");
const Order = require("../models/order-model");
const Category = require("../models/category-model");
const sendResponse = require("../utils/response-handler");


const add = async (req, res) => {
    try {
        const { order_id, category_id, item_name } = req.body;

        if (!item_name || item_name == "") {
            return sendResponse(res, 400, {}, "Item name is required");
        }

        if (!order_id || !mongoose.Types.ObjectId.isValid(order_id)) {
            return sendResponse(res, 400, {}, "Invalid or missing Order ID");
        }
        if (!category_id || !mongoose.Types.ObjectId.isValid(category_id)) {
            return sendResponse(res, 400, {}, "Invalid or missing Category ID");
        }


        const orderExist = await Order.findById(order_id);
        if (!orderExist) {
            return sendResponse(res, 400, {}, "Given Order ID does not exist");
        }

        const categoryExist = await Category.findById(category_id);
        if (!categoryExist) {
            return sendResponse(res, 400, {}, "Given Category ID does not exist");
        }

        const item = await Item.create({
            order_id,
            category_id,
            item_name
        });

        return sendResponse(res, 200, { item }, "Item Added Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `add item controller error : ${e}`);
    }
}

const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
            return sendResponse(res, 400, {}, 'Invalid or missing Item ID');
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return sendResponse(res, 404, {}, 'Item not found');
        }

        const orderId = item.order_id;

        await Item.findByIdAndDelete(itemId);

        const remainingItems = await Item.find({ order_id: orderId });

        if (remainingItems.length === 0) {
            await Order.findByIdAndDelete(orderId);
        }

        return sendResponse(res, 200, {}, 'Item deleted successfully');
    } catch (e) {
        return sendResponse(res, 500, {}, `delete item controller error: ${e}`);
    }
};

const getItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
            return sendResponse(res, 400, {}, 'Invalid or missing Item ID');
        }

        const item = await Item.findById(itemId)
            .populate('order_id')
            .populate('category_id');

        if (!item) {
            return sendResponse(res, 404, {}, 'Item not found');
        }

        return sendResponse(res, 200, { item }, 'Item fetched successfully');
    } catch (e) {
        return sendResponse(res, 500, {}, `get item controller error: ${e}`);
    }
};

const getItemsByOrderId = async (req, res) => {
    try {
        const orderId = req.params.id;

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return sendResponse(res, 400, {}, 'Invalid or missing Order ID');
        }

        const items = await Item.find({ order_id: orderId })
            .populate('category_id');

        if (items.length === 0) {
            return sendResponse(res, 404, {}, 'No items found for this order');
        }

        return sendResponse(res, 200, { items }, 'Items fetched successfully');
    } catch (e) {
        return sendResponse(res, 500, {}, `get items by order ID controller error: ${e}`);
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id || id.trim() === "") {
            return sendResponse(res, 400, {}, "Please provide a valid item ID.");
        }

        const item = await Item.findById(id);
        if (!item) {
            return sendResponse(res, 404, {}, "Item not found.");
        }

        if (req.file) {
            updates.sample_image = req.file.filename; // or req.file.path if you prefer full path
        }

        if (updates.category_id) {
            const categoryExists = await Category.findById(updates.category_id);
            if (!categoryExists) {
                return sendResponse(res, 400, {}, "Invalid category_id: Category not found.");
            }
        }

        const updatedItem = await Item.findByIdAndUpdate(id, updates, { new: true });

        return sendResponse(res, 200, { item: updatedItem }, "Item updated successfully.");
    } catch (e) {
        return sendResponse(res, 500, {}, `updateItem controller error: ${e.message}`);
    }
};




module.exports = { add, deleteItem, getItem, getItemsByOrderId, updateItem };
