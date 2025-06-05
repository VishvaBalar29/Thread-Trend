const mongoose = require("mongoose");

// stores all measurement
const measurementSchema = new mongoose.Schema({
    key_name : {
        type : String,
        required : true,
    }
});


const Measurement = new mongoose.model("Measurement", measurementSchema);

module.exports = Measurement;