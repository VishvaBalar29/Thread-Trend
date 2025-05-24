require("dotenv").config();
const express = require("express");
const app = express();
const customerRouter = require("./routers/customer-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware")

app.use(express.json());

app.get("/hello", (req, res) => {
    res.send("Hello, Tailoring world !");
});

app.use("/customer", customerRouter);

// for error-middleware
app.use(errorMiddleware);

const PORT = 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`);
    })
})
