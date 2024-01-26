const response = require('../utils/response');
const {Reservation, Mount, User, Order} = require('../db/models/');

module.exports = {
    history: async (req, res, next) => {
        try {
            const userId = req.user.id; // Menggunakan id pengguna dari token JWT
    
            // Cari semua order yang dimiliki oleh pengguna dengan id_user yang sesuai
            const userOrders = await Order.find({ id_user: userId });
    
            // Objek respons yang mencakup informasi yang ingin ditampilkan
            const orderHistory = userOrders.map(order => ({
                _id: order._id,
                id_reservasi: order.id_reservasi,
                total: order.total,
                status_pembayaran: order.status_pembayaran,
                metode_pembayaran: order.metode_pembayaran,
                createdAt: order.createdAt,
                // Tambahkan atribut lain sesuai kebutuhan
            }));
    
            return response.successOK(res, 'Order history retrieved successfully', orderHistory);
        }catch(err) {
            next(err)
        }
    },

    detail: async (req, res, next) => {
        try {
            const {orderid} = req.params; // Menggunakan id order dari parameter URL
    
            // Cari order berdasarkan _id
            const order = await Order.findOne({ _id: orderid });
    
            // Periksa apakah order ditemukan
            if (!order) {
                return response.errorNotFound(res, 'Order not found', null);
            }

            // Cari data reservasi berdasarkan id_reservasi pada order
            const reservasi = await Reservation.findOne({ _id: order.id_reservasi });

            const user = await User.findById(reservasi.user_id);
            if (!user) {
                return res.status(404).json(response.error('User not found'));
            }
    
            const anggotaPendakiData = await Promise.all(reservasi.anggota_pendaki.map(async (code) => {
                const anggota = await User.findOne({ code });
                return {
                    code: anggota.code,
                    email: anggota.email,
                    name: anggota.name,
                    address: anggota.address,
                    phone: anggota.phone,
                };
            }));

            // let check_in = order.check_in;
            let check_in = order.check_in;
            let check_out = order.check_out;

            // Periksa kondisi check_in dan check_out
            if (check_in === false && check_out === false) {
                check_in = '-';
                check_out = '-';
            }

            // Objek respons yang mencakup informasi yang ingin ditampilkan
            const orderDetail = {
                status_pembayaran: order.status_pembayaran,
                check_in: check_in,
                check_out: check_out,
                metode_pembayaran: order.metode_pembayaran,
                total: order.total,
                durasi_pendakian: reservasi.durasi_pendakian,
                jumlah_pendaki: reservasi.jumlah_pendaki,
                tanggal_pendakian: reservasi.tanggal_pendakian,
                pendaki: anggotaPendakiData,
                // createdAt: order.createdAt,
                // Menambahkan data reservasi ke dalam respons
                // Tambahkan atribut lain sesuai kebutuhan
            };
    
            return response.successOK(res, 'Order detail retrieved successfully', orderDetail);
        } catch (error) {
            next(error);
        }
    },

    cancel: async (req, res, next) => {
        try{

        }catch(err){
            next(err);
        }
    },
}