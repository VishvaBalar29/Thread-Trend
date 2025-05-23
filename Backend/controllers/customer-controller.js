const { application } = require("express");
const Customer = require("../models/customer-model");
const random = require('random');
const sendEmail = require("../services/mail-service");
const jwt = require("jsonwebtoken");



const addCustomer = async (req, res) => {
    try {
        const { name, email, mobile_number } = req.body;
        const customerExist = await Customer.findOne({ email });
        if (customerExist) {
            res.status(400).json({ msg: "Email Already Exist" });
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

        return res.status(200).json({
            msg: customer,
            token: await customer.generateToken(),
            customerId: customer._id.toString()
        });
    }
    catch (e) {
        return res.status(400).json({ msg: `addCustomer Controller error ${e}` });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailExist = await Customer.findOne({ email });
        if (!emailExist) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isMatch = await emailExist.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        return res.status(200).json({
            msg: "Login Successfully",
            token: await emailExist.generateToken(),
            customerId: emailExist._id.toString(),
        })
    } catch (error) {
        return res.status(400).json({ msg: `login Controller error ${e}` });
    }
}

const getAllCustomer = async (req, res) => {
    try {
        const customers = await Customer.find({}, { password: 0, is_admin: 0, __v: 0 });
        if (!customers) {
            return res.status(200).json({ msg: "Customers not found" });
        }
        return res.status(200).json({ msg: customers });
    } catch (error) {
        return res.status(400).json({ msg: `getAllCustomer Controller error ${e}` });
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
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        const customerExist = await Customer.findOne({ _id: id });
        if (!customerExist) {
            return res.status(400).json({ msg: `given customer ID is not found` });
        }
        await Customer.deleteOne({ _id: id });
        return res.status(200).json({ msg: `Deleted Successfully` });
    } catch (error) {
        return res.status(400).json({ msg: `deleteCustomerById Controller error ${e}` });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const id = req.query.id;
        const updateData = req.body;

        console.log("Updating customer:", id);
        console.log("With data:", updateData);

        if (!id) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        // Try to update
        const customer = await Customer.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true, select: '-password' }
        );

        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        res.status(200).json({ msg: "Customer updated successfully", customer });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(400).json({ msg: `updateCustomer Controller error ${error.message}` });
    }
};

const updatePassword = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword) {
            return res.status(400).json({ msg: "Please enter current Password" });
        }

        const customer = await Customer.findOne({ _id: id });
        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        const isMatch = await customer.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ msg: "Current password is incorrect" });
        }
        if (!newPassword) {
            return res.status(400).json({ msg: "Please enter new Password" });
        }
        customer.password = newPassword;
        await customer.save();
        return res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        return res.status(400).json({ msg: `updatePassword Controller error ${error.message}` });
    }
}

const requestForForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) return res.status(404).json({ message: "Customer doesn't exist" });

        const token = await customer.generateResetToken();;
        const resetURL = `https://localhost:5000/customer/forgot-password?id=${customer._id}&token=${token}`;

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
        
        res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
        return res.status(400).json({ msg: `requestForForgotPassword Controller error ${error.message}` });
    }
}

const forgotPassword = async (req,res) => {
    try {
        const { id, token } = req.query;
        const { password } = req.body;
        const customer = await Customer.findOne({ _id: id });
        if (!customer) {
            return res.status(400).json({ message: "Customer not exists!" });
        }
        const secret = process.env.JWT_SECRET_KEY + customer.password;
        jwt.verify(token, secret);

        customer.password = password;
        await customer.save();

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        res.status(400).json({ msg: `forgotPassword Controller error ${error.message}` });
    }
}


module.exports = { addCustomer, login, getAllCustomer, getCustomerById, deleteCustomer, updateCustomer, updatePassword, requestForForgotPassword, forgotPassword };