const customer = require("../models/customer-model");
const order = require("../models/order-model");
const item = require("../models/item-model");
const category = require("../models/category-model");
const design = require("../models/design-model");
const measurement = require("../models/measurement-model");
const sendResponse = require("../utils/response-handler");

const getAllCounts = async(req,res) => {
    try {
        const customers = await customer.countDocuments();
        const orders = await order.countDocuments();
        const items = await item.countDocuments();
        const categories = await category.countDocuments();
        const designs = await design.countDocuments();
        const measurements = await measurement.countDocuments();
        return sendResponse(res, 200, {customers, orders, items, categories, designs, measurements}, "Counts fetched");
    } catch (e) {
        return sendResponse(res, 400, {}, `getAllCounts Controller error ${e}`);
    }
}

module.exports = { getAllCounts } ;