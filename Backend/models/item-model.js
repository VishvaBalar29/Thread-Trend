const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    item_name: {
        type: String,
        required: true,
    },
    silaiCharges: {
        type: Number,
        default: 0,
    },
    sample_image: {
        type: String,
        default: "",
    },
})

const Item = new mongoose.model("Item", itemSchema);

module.exports = Item;