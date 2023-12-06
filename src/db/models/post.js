const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    post: [{
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }],
    likes: [{
        type: ObjectId,
        ref: "User",
    }],
    comments: [{
        text: String,
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
    }],
    postedBy: {
        type: ObjectId,
        ref: "User",
    },    

}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
