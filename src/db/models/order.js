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
    tanggal_pendakian: {
        type: Date,
        required: false,
    },
    total: {
        type: Number,
        required: true,
    },
    check_in: {
        type: Date,  
        default: null,  
    },
    check_out: {
        type: Date,  
        default: null,  
    },
    status_pembayaran: {
        type: String,
        enum: ['pending', 'success', 'completed', 'cancelled'],
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
