const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const reservationSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  mount_id: {
    type: ObjectId,
    ref: 'Mount',
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  jumlah_pendaki: {
    type: Number,
    required: true,
  },
  tanggal_pendakian: {
    type: String,
    required: true,
  },
  durasi_pendakian: {
    type: String,
    required: true,
  },
    // check_in: {
  //   type: Date,
  //   required: false,
  // },
  // check_out: {
  //   type: Date,
  //   required: false,
  // },
  anggota_pendaki: [
    {
      type: String, // code user
      // ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Tambahkan atribut lain sesuai kebutuhan
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
