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
    code_reservasi: {
        type: String,
        default: false,
    },
    check_in: {
        type: String,
        default: false,
    },
    check_out: {
        type: String,
        default: false,
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
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
