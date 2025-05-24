const {z} = require('zod');

const registerSchema = z.object({
    name : z
        .string({required_error : "Name is Required"})
        .trim()
        .min(3, {message : "Name must be at least of 3 characters"})
        .max(255, {message : "Name must not be more than 255 characters"}),
    email : z
        .string({required_error : "Email is Required"})
        .trim()
        .email({message : "Invalid email address"}),
    mobile_number : z
        .string({required_error : "Phone number is Required"})
        .trim()
        .min(10, {message : "Phone must be at least 10 digits"})
        .max(10, {message : "Phone must be at least 10 digits"}),
})


const loginSchema = z.object({
    email : z    
        .string({required_error : "Email is Required"})
        .email({message : "Email is Invalid"}),
    password : z
        .string({required_error : "Password is Required"})
})

module.exports = {registerSchema, loginSchema};