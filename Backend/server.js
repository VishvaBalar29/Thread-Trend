require("dotenv").config();
const express = require("express");
const app = express();
const customerRouter = require("./routers/customer-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware")
const cors = require('cors');


// handling data from frontend
const corsOptions = {
    origin : "http://localhost:5173",
    method : "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials : true
}
app.use(cors(corsOptions));


// use for parse content in json
app.use(express.json());


// routers
app.use("/customer", customerRouter);


// for error-middleware
app.use(errorMiddleware);


const PORT = 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`);
    })
})
