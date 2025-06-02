const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now  
    },
    delivery_date: {
        type: Date,
        default: Date.now  
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
});

const Order = new mongoose.model("Order", orderSchema);

module.exports = Order;