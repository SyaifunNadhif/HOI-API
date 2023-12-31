const mongoose = require('mongoose');


const mountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ticket_price: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photos: {
        type: String,
        default: 'no foto'
    },
    // photos: {
    //     type: [String],  // Array of Strings
    //     default: ['no foto'],
    // },
    basecamp: {
        type: String,
        required: true,
    },
});

const Mount = mongoose.model('Mount', mountSchema);

module.exports = Mount;
