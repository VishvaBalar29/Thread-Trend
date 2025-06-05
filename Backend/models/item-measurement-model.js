const mongoose = require("mongoose");

// relate to measurement table of all items
const item_measurementSchema = new mongoose.Schema({
    item_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Item",
        required : true
    },
    key_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Measurement",
        required : true
    },
    value : {
        type : String,
        required : true
    }
});

const Item_measurement = new mongoose.model("ItemMeasurement", item_measurementSchema);

module.exports = Item_measurement;