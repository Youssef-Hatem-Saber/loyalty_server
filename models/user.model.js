const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter your name"],
        },
        email: {
            type: String,
            required: [true, "Please Enter your email"],
            unique: true,

        },
        password: {
            type: String,
            required: [true, "Please Enter a password"],

        },
        phone: {
            type: String,
            required: false
        },
        points: {
            type: Number,
            required: false,
            default:0
        },
        refreshToken: {
            type: String,
            default: null
        }
    }, {
    timestamps: true,
}
)
const user = mongoose.model('User', userSchema);
module.exports = user;