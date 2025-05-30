const mongoose = require("mongoose");

const designSchema = new mongoose.Schema({
    category_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    image : {
        type : String
    }
}, {timestamps : true});

const Design = new mongoose.model("Design", designSchema);

module.exports = Design;