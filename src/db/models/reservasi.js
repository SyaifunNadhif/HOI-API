const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mount',
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
  jumlah_pendaki: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Tambahkan atribut lain sesuai kebutuhan
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
