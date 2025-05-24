const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response-handler");

const tokenBlacklist = new Set();

// Middleware to check if user is logged in
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendResponse(res, 400, {}, "No token provided....you need to login first");
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    if (!token || token === "{{authToken}}"){
        return sendResponse(res, 400, {}, "No token provided....you need to login first");
    }

    // Uncomment this if you want to enable blacklist check
    // if (tokenBlacklist.has(token)) {
    //     return sendResponse(res, 401, {}, "Token revoked, please login again");
    // }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        
        req.user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, 401, {}, "Token is invalid or expired");
    }
};

// Middleware to check if user is admin
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.is_admin) {
        next();
    } else {
        return sendResponse(res, 403, {}, "Access forbidden: admins only");
    }
};


// Middleware to prevent access if user is already logged in
const preventLoggedInAccess = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("PreventLoggedInAccess middleware - authHeader:", authHeader);

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        if (tokenBlacklist.has(token)) {
            console.log("Token is blacklisted, treating as logged out");
            return next();
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("Token is valid. Blocking access.");
            return sendResponse(res, 400, {}, "You are already logged in");
        } catch (error) {
            console.log("Token is invalid/expired. Allowing access.");
            return next();
        }
    } else {
        console.log("No token. Allowing access.");
        return next();
    }
};

// Middleware to check if user is already logged out
const checkLogout = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendResponse(res, 400, {}, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (tokenBlacklist.has(token)) {
        return sendResponse(res, 400, {}, "User already logged out");
    }

    next();
};

module.exports = { authMiddleware, authorizeAdmin, preventLoggedInAccess, tokenBlacklist, checkLogout };
