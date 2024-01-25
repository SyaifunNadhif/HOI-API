const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    id_reservasi: {
        type: ObjectId,
        ref: 'Reservasi',
        required: true,
    },
    id_user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    check_in: {
        type: Date,
        required: true,
    },
    check_out: {
        type: Date,
        required: true,
    },
    status_pembayaran: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    metode_pembayaran: {
        type: String,
        default: 'onsite',
        enum: ['onsite'],
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
