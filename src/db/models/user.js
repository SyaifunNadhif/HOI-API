const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    avatar:{
        type:String,
        default:"no avatar"
    },
    userType:{
        type:String,
        default:"basic"
    },
    resetToken:String,
    expireToken:Date,
    followers:[{
        type: ObjectId,
        ref: "User"
    }],
    following:[{
        type: ObjectId,
        ref: "User"
    }]

});

const User = mongoose.model('User', userSchema);
module.exports = User;