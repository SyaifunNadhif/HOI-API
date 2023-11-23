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
    photo: {
        type: String,
        default: "no photo",
    },
    // post: [{
    //     type: mongoose.Schema.Types.Mixed,
    //     required: true,
    // }],
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
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
