const nodemailer = require('nodemailer');
require('dotenv').config(); // if using environment variables

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html,
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
