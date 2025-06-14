const mongoose = require('mongoose');
const Order = require("../models/order-model");
const Customer = require("../models/customer-model");
const Item = require("../models/item-model");
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

const deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return sendResponse(res, 400, {}, "Order ID is required");
        }
        const orderExist = await Order.findByIdAndDelete(id);
        if (!orderExist) {
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
        if (!id) {
            return sendResponse(res, 400, {}, "Order ID is required");
        }
        const orderExist = await Order.findById(id);
        if (!orderExist) {
            return sendResponse(res, 400, {}, "Given order id is not found");
        }
        return sendResponse(res, 200, { orderExist }, "Fetched Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `get order controller error : ${e}`)
    }
}

const getOrderByCustomerId = async (req, res) => {
    try {
        const custId = req.params.custId;

        if (!custId) {
            return sendResponse(res, 400, {}, "Customer ID is requireddd");
        }
        if (custId != req.user.customerId && !req.user.is_admin) {
            return sendResponse(res, 403, {}, "You are not authorized to update this customer");
        }


        if (!custId) {
            return sendResponse(res, 400, {}, "Customer ID is required");
        }
        // Find orders by customer ID
        const orders = await Order.find({ customer_id: custId });
        if (orders.length === 0) {
            return sendResponse(res, 404, {}, "No orders found for given customer ID");
        }

        // Extract all order IDs from found orders
        const orderIds = orders.map(order => order._id);


        // Step 2: Find items using orderIds
        const items = await Item.find({ orderId: { $in: orderIds } });

        return sendResponse(res, 200, { orders, items }, "Fetched Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `get getOrderByCustomerId controller error : ${e}`)
    }
}

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, delivery_date } = req.body;

        if (!status && !delivery_date) {
            return sendResponse(res, 400, {}, "At least one field (status or delivery_date) must be provided.");
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return sendResponse(res, 404, {}, "Order not found.");
        }

        if (delivery_date) {
            const orderDate = new Date(order.order_date);
            const newDeliveryDate = new Date(delivery_date);
            if (newDeliveryDate <= orderDate) {
                return sendResponse(res, 400, {}, "Delivery date must be after order date.");
            }
            order.delivery_date = newDeliveryDate;
        }

        if (status) {
            order.status = status;
        }

        await order.save();

        return sendResponse(res, 200, { order }, "Order updated successfully.");
    } catch (e) {
        return sendResponse(res, 400, {}, `updateOrder controller error : ${e}`);
    }
}



module.exports = { add, deleteOrder, getOrder, getOrderByCustomerId, updateOrder };