const mongoose = require("mongoose");

// default measurement table
const default_measurementSchema = new mongoose.Schema({
    category_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    key_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Measurement",
        required : true
    }
});

const Default_measurement = new mongoose.model("DefaultMeasurement", default_measurementSchema);

module.exports = Default_measurement;