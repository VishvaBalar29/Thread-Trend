require("dotenv").config();
const express = require("express");
const app = express();
const customerRouter = require("./routers/customer-router");
const categoryRouter = require("./routers/category-router");
const designRouter = require("./routers/design-router");
const orderRouter = require("./routers/order-router");
const itemRouter = require("./routers/item-router");
const measurementRouter = require("./routers/measurement-router");
const defaultMeasurementRouter = require("./routers/default-measurement-router");
const itemMeasurementRouter = require("./routers/item-measurement-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware")
const cors = require('cors');


// handling data from frontend
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));


// use for parse content in json
app.use(express.json());


// for stores images
app.use("/uploads", express.static("uploads"));


// routers
app.use("/customer", customerRouter);
app.use("/category", categoryRouter);
app.use("/design", designRouter);
app.use("/order", orderRouter);
app.use("/item", itemRouter);
app.use("/measurement", measurementRouter);
app.use("/default-measurement", defaultMeasurementRouter);
app.use("/item-measurement", itemMeasurementRouter);


// for error-middleware
app.use(errorMiddleware);



const PORT = 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`);
    })
})
