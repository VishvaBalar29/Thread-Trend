const mongoose = require('mongoose');
const Order = require("../models/order-model");
const Customer = require("../models/customer-model");
const sendResponse = require("../utils/response-handler");

const add = async (req, res) => {
    try {
        const { customer_id } = req.body;

        if (!customer_id || !mongoose.Types.ObjectId.isValid(customer_id)) {
            return sendResponse(res, 400, {}, "Invalid or missing customer_id.");
        }

        const customerExist = await Customer.findOne({ _id: customer_id });
        if (!customerExist) {
            return sendResponse(res, 400, {}, "Given Customer ID is not exist.");
        }
        const order = await Order.create({ customer_id });
        return sendResponse(res, 200, { order }, "Order Added Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `Order add controller error : ${e}`)
    }
}

const deleteOrder = async (req,res) =>{
    try {
        const id = req.params.id;
        if(!id){
            return sendResponse(res, 400, {}, "Order ID is required");
        }
        const orderExist = await Order.findByIdAndDelete(id);
        if(!orderExist){
            return sendResponse(res, 400, {}, "Given order id is not found");
        }
        return sendResponse(res, 200, {}, "Deleted Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `delete order controller error : ${e}`);
    }
}

const getOrder = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return sendResponse(res, 400, {}, "Order ID is required");
        }
        const orderExist = await Order.findById(id);
        if(!orderExist){
            return sendResponse(res, 400, {}, "Given order id is not found");
        }
        return sendResponse(res, 200, {orderExist}, "Fetched Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `get order controller error : ${e}`)
    }
}




module.exports = { add,deleteOrder, getOrder };