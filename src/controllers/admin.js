const response = require('../utils/response');
const {Reservation, Mount, User, Order} = require('../db/models/');

module.exports = {
    pendingReservasi: async (req, res, next) => {
        try {
            const status = "pending"; // Menggunakan id pengguna dari token JWT
            
            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }

            // Cari semua order yang dimiliki oleh pengguna dengan id_user yang sesuai
            const pendingReservasi = await Order.find({ status_pembayaran: status });
    
            // Objek respons yang mencakup informasi yang ingin ditampilkan
            const allreservasi = pendingReservasi.map(order => {
                // Periksa kondisi check_in dan check_out
                const formattedCheckIn = order.check_in === null ? '-' : order.check_in;
                const formattedCheckOut = order.check_out === null ? '-' : order.check_out;
            
                return {
                    _id: order._id,
                    id_reservasi: order.id_reservasi,
                    total: order.total,
                    ketua: 'nana',
                    check_in: formattedCheckIn,
                    check_out: formattedCheckOut,
                    status_pembayaran: order.status_pembayaran,
                    metode_pembayaran: order.metode_pembayaran,
                    createdAt: order.createdAt,
                    // Tambahkan atribut lain sesuai kebutuhan
                };
            });
    
            return response.successOK(res, 'Order history retrieved successfully', allreservasi);
        }catch(err) {
            next(err)
        }
    },

    successReservasi: async (req, res, next) => {
        try {
            const status = "success"; // Menggunakan id pengguna dari token JWT

            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }
    
            // Cari semua order yang dimiliki oleh pengguna dengan id_user yang sesuai
            const successReservasi = await Order.find({ status_pembayaran: status });
    
            // Objek respons yang mencakup informasi yang ingin ditampilkan
            const allreservasi = successReservasi.map(order => {
                // Periksa kondisi check_in dan check_out
                const formattedCheckIn = order.check_in === null ? '-' : order.check_in;
                const formattedCheckOut = order.check_out === null ? '-' : order.check_out;
            
                return {
                    _id: order._id,
                    id_reservasi: order.id_reservasi,
                    total: order.total,
                    ketua: 'nana',
                    check_in: formattedCheckIn,
                    check_out: formattedCheckOut,
                    status_pembayaran: order.status_pembayaran,
                    metode_pembayaran: order.metode_pembayaran,
                    createdAt: order.createdAt,
                    // Tambahkan atribut lain sesuai kebutuhan
                };
            });
    
            return response.successOK(res, 'Order history retrieved successfully', allreservasi);
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
            if (check_in === null && check_out === null) {
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

    checkIn: async (req, res, next) => {
        try {
            const { orderid } = req.params;

            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }

            // Cari order berdasarkan _id
            const order = await Order.findOne({ _id: orderid });

            // Periksa apakah order ditemukan
            if (!order) {
                return response.errorNotFound(res, 'Order not found', null);
            }

            // Periksa apakah order sudah check-in atau check-out
            if (order.check_in !== null) {
                return response.errorBadRequest(res, 'Order has already been checked in', null);
            }

            // Update waktu check-in dan status_pembayaran menjadi "success"
            order.check_in = new Date();
            order.status_pembayaran = 'success';
            await order.save();

            return response.successOK(res, 'Check-in successful', null);
        } catch (error) {
            next(error);
        }
    },

    checkOut: async (req, res, next) => {
        try {
            const { orderid } = req.params;

            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }

            // Cari order berdasarkan _id
            const order = await Order.findOne({ _id: orderid });

            // Periksa apakah order ditemukan
            if (!order) {
                return response.errorNotFound(res, 'Order not found', null);
            }

            // Periksa apakah order sudah check-out
            if (order.check_out !== null) {
                return response.errorBadRequest(res, 'Order has already been checked out', null);
            }

            // Update waktu check-out dan status_pembayaran menjadi "completed"
            order.check_out = new Date();
            order.status_pembayaran = 'completed';
            await order.save();

            return response.successOK(res, 'Check-out successful', null);
        } catch (error) {
            next(error);
        }
    },
}