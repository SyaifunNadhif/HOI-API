const mongoose = require('mongoose');

const paketSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    deskripsi: {
        type: String,
        required: true,
    },
    harga: {
        type: Number,
        required: true,
    },
    photo: {
        type: String, // Jika Anda menyimpan URL gambar atau nama file gambar
        required: true,
    },
}, { timestamps: true });

const Paket = mongoose.model("Paket", packageSchema);

module.exports = Paket;
