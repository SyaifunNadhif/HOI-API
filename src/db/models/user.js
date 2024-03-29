const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: false,
    },
    user_type: {
        type: String,
        default: "basic",
    },
    phone: {
        type: String,
        default: false,
    },
    address: {
        type: String,
        default: false
    },
    parent_number: {
        type: String,
        default: false
    },
    code: {
        type: String,
        default: false
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;