const mongoose = require("mongoose");
const URL = process.env.MONGODB_URL;

const connectDb = async () =>{
    try{
        await mongoose.connect(URL);
        console.log("Database Connection Successful");
    }
    catch(error){
        console.log(error);
        console.log("Database connecion failed\n");
        process.exit(0);
    }
}

module.exports = connectDb;