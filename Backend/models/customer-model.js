const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile_number: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    joined_date: {
        type: Date,
        default: Date.now,
    },
    is_admin: {
        type: Boolean,
        default: false,
    }
})

// Automatically hash password before saving
customerSchema.pre('save', async function (next) {
    const customer = this;
    if (!customer.isModified("password")) {
        next();
    }
    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(customer.password, saltRound);
        customer.password = hash_password;
    } catch (error) {
        next(error);
    }
})


// Generate JWT token for authentication
customerSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            customerId: this._id.toString(),
            email: this.email,
            is_admin: this.is_admin
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "30d",
        }
        )
    } catch (error) {
        console.log(error);
        
    }
}

customerSchema.methods.generateResetToken = function () {
    const secret = process.env.JWT_SECRET_KEY + this.password;
    return jwt.sign(
        {
            customerId: this._id,
            email: this.email,
        },
        secret,
        { expiresIn: "15m" }
    );
};



// compare password while login
customerSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
}


const Customer = new mongoose.model("Customer", customerSchema);

module.exports = Customer;