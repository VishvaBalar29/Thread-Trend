require("dotenv").config();
const express = require("express");
const app = express();
const customerRouter = require("./routers/customer-router");
const categoryRouter = require("./routers/category-router");
const designRouter = require("./routers/design-router");
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


// for error-middleware
app.use(errorMiddleware);



const PORT = 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`);
    })
})
