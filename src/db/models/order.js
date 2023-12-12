const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true,
  },
  anggota_pendaki: [{
    username: {
      type: String,
      required: true,
    },
    // Tambahkan atribut lain sesuai kebutuhan
  }],
  metode_pembayaran: {
    type: String,
    enum: ['bayar_di_tempat', 'transfer'],
    required: true,
  },
  total_pembayaran: {
    type: Number,
    required: true,
  },
  // Tambahkan atribut lain sesuai kebutuhan
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
