const { application } = require("express");
const Customer = require("../models/customer-model");
const random = require('random');
const sendEmail = require("../services/mail-service");
const jwt = require("jsonwebtoken");
const { tokenBlacklist } = require("../middlewares/auth-middleware");
const sendResponse = require("../utils/response-handler");


const addCustomer = async (req, res) => {
    try {
        const { name, email, mobile_number } = req.body;

        const customerExist = await Customer.findOne({ email });
        if (customerExist) {
            return sendResponse(res, 400, {}, "123 - Email Already Exist");
        }
        const password = Math.floor(100000 + Math.random() * 900000);
        const customer = await Customer.create({ name, email, mobile_number, password });

        const html = `
            <!DOCTYPE html>
            <html>
            <body>
                <h2>Welcome to <span style="color: #e91e63;">Thread & Trend</span>!</h2>
                <p>Dear Customer,</p>
                <p>We're thrilled to have you on board! 🎉</p>
                <p><strong>Here is your temporary password:</strong></p>
                <p style="font-size: 18px; background: #e91e63; color: white; display: inline-block; padding: 8px 12px; border-radius: 5px;">${password}</p>
                <p>Please change it after logging in.</p>
                <p>Thanks,<br>The Thread & Trend Team</p>
            </body>
            </html>

            `;
        await sendEmail({
            to: email,
            subject: 'Welcome to Thread & Trend!',
            html
        });

        return sendResponse(res, 200, {
            customer : customer,
            token: await customer.generateToken(),
            customerId: customer._id.toString()
        },"Registered Successfully");
    }
    catch (e) {
        return sendResponse(res, 400, {}, `addCustomer Controller error ${e}` )
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailExist = await Customer.findOne({ email });
        if (!emailExist) {
            return sendResponse(res, 400, {}, "Invalid Credentials");
        }
        const isMatch = await emailExist.comparePassword(password);
        if (!isMatch) {
            return sendResponse(res, 400, {}, "Invalid Credentials");
        }
        return sendResponse(res, 200, {
            token: await emailExist.generateToken(),
            customerId: emailExist._id.toString(),
        },"Login Successfully");
    } catch (error) {
        return sendResponse(res, 400, {}, `login Controller error ${error}` );
    }
}

const getAllCustomer = async (req, res) => {
    try {
        const customers = await Customer.find({}, { password: 0, is_admin: 0, __v: 0 });
        if (customers.length === 0) {
            return sendResponse(res, 200, {}, "Customers not found");
        }
        return sendResponse(res, 200, {customers}, "Customers fetched");
    } catch (e) {
        return sendResponse(res, 400, {}, `getAllCustomer Controller error ${e}`);
    }
}

const getCustomerById = async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        const customer = await Customer.findOne({ _id: id }, { password: 0, is_admin: 0, __v: 0 });
        if (!customer) {
            return res.status(200).json({ msg: "Customer not found" });
        }
        return res.status(200).json({ msg: customer });
    } catch (error) {
        return res.status(400).json({ msg: `getCustomerById Controller error ${e}` });
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return sendResponse(res, 400, {}, "Customer ID is required");
        }

        const customerExist = await Customer.findOne({ _id: id });
        if (!customerExist) {
            return sendResponse(res, 400, {}, "given customer ID is not found");
        }
        await Customer.deleteOne({ _id: id });
        return sendResponse(res, 200, {}, "Deleted Successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `deleteCustomerById Controller error ${e}`);
    }
}

const updateCustomer = async (req, res) => {
    try {
        const id = req.query.id;
        const updateData = req.body;

        console.log("Updating customer:", id);
        console.log("With data:", updateData);

        if (!id) {
            return sendResponse(res, 400, {}, "Customer ID is required" );
        }

        
        if(id != req.user.customerId && !req.user.is_admin){
            return sendResponse(res, 403, {}, "You are not authorized to update this customer");
        }

        const allowedFields = ["name", "email", "mobile_number"];
        const invalidFields = Object.keys(req.body).filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return sendResponse(res, 400, {}, `Cannot update: ${invalidFields.join(", ")}`);
        }

        const customer = await Customer.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true, select: '-password' }
        );

        if (!customer) {
            return sendResponse(res, 400, {}, "Customer not found");
        }
        return sendResponse(res, 200, {updatedCustomer: customer}, "Customer updated successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `updateCustomer Controller error ${e}`);
    }
};

const updatePassword = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return sendResponse(res, 400, {}, "Customer ID is required");
        }
        if(id != req.user.customerId){
            return sendResponse(res, 403, {}, "You are not authorized to update this customer");
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword) {
            return sendResponse(res, 400, {}, "Please enter current Password");
        }

        const customer = await Customer.findOne({ _id: id });
        if (!customer) {
            return sendResponse(res, 400, {}, "Customer not found");
        }

        const isMatch = await customer.comparePassword(currentPassword);
        if (!isMatch) {
            return sendResponse(res, 400, {}, "Current password is incorrect");
        }
        if (!newPassword) {
            return sendResponse(res, 400, {}, "Please enter new Password");
        }
        customer.password = newPassword;
        await customer.save();
        return sendResponse(res, 200, {}, "Password updated successfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `updatePassword Controller error ${e}`);
    }
}

const requestForForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ email });       
        if (!customer) return sendResponse(res, 400, {}, "Customer doesn't exist");

        const token = await customer.generateResetToken();
        const resetURL = `${process.env.URL}/customer/forgot-password?id=${customer._id}&token=${token}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
            <style>
                body {
                font-family: Arial, sans-serif;
                background: #f9f9f9;
                color: #333;
                padding: 20px;
                max-width: 600px;
                margin: auto;
                border: 1px solid #eee;
                }
                h2 { color: #007bff; }
                a.button {
                display: inline-block;
                padding: 12px 20px;
                margin: 20px 0;
                background: #007bff;
                color: #fff !important;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                }
            </style>
            </head>
            <body>
            <h2>Password Reset Request</h2>
            <p>Hi,</p>
            <p>We received a request to reset the password for your account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetURL}" class="button">Reset Password</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <small>If the button doesn’t work, copy and paste this URL into your browser:</small>
            <small>${resetURL}</small>
            </body>
            </html>
            `
        await sendEmail({
            to: email,
            subject: 'Forgot Password',
            html
        });
        return sendResponse(res, 200, {}, "Password reset link sent");
    } catch (e) {
        return sendResponse(res, 400, {}, `requestForForgotPassword Controller error ${e}`);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { id, token } = req.query;
        const { password } = req.body;
        const customer = await Customer.findOne({ _id: id });
        if (!customer) {
            return sendResponse(res, 400, {}, "Customer not exists!");
        }
        const secret = process.env.JWT_SECRET_KEY + customer.password;
        jwt.verify(token, secret);

        customer.password = password;
        await customer.save();
        return sendResponse(res, 200, {}, "Password has been reset successfully.");
    } catch (e) {
        return sendResponse(res, 400, {}, `forgotPassword Controller error ${e}`);
    }
}

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(res, 400, {}, "No token provided");
        }

        const token = authHeader.split(" ")[1];
        tokenBlacklist.add(token); // add token to blacklist
        return sendResponse(res, 200, {}, "logout succesfully");
    } catch (e) {
        return sendResponse(res, 400, {}, `logout Controller error ${e}`);
    }
}

const user = async (req,res) => {
    try {   
        const customerData = req.user;
        console.log(customerData);
        return sendResponse(res, 200, {userData : customerData}, "Customer Fetched");       
    } catch (e) {
        return sendResponse(res, 400, {}, `error from the uesr route ${e}`);
    }
}

module.exports = { addCustomer, login, getAllCustomer, getCustomerById, deleteCustomer, updateCustomer, updatePassword, requestForForgotPassword, forgotPassword, logout, user };