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
    photo: [{
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }],
    basecamp: {
        type: String,
        required: true,
    },
});

const Mount = mongoose.model('Mount', mountSchema);

module.exports = Mount;
