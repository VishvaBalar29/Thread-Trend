const sendResponse = require("../utils/response-handler");

const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "BACKEND ERROR";
    const extraDetails = err.extraDetails || "Error From Backend"

    return sendResponse(res, status, {}, `${message}: ${extraDetails}`);
    // return res.status(status).json({message, extraDetails});
}

module.exports = errorMiddleware;