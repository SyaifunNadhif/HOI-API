const response = require('../utils/response');
const moment = require('moment');

const {Reservation, User, Order} = require('../db/models/');

module.exports = {
    reservasiNext: async (req, res, next) => {
        try {
            const status = req.query.status;
    
            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }
    
            // Cari semua order yang memiliki status_pembayaran 'pending' dan tanggal_pendakian lebih besar atau sama dengan tanggal saat ini
            const pendingReservasi = await Order.aggregate([
                {
                    $match: {
                        status_pembayaran: status,
                        // Menambahkan filter tanggal_pendakian
                        tanggal_pendakian: { $gte: moment().startOf('day').toDate() },
                    },
                },
                {
                    $project: {
                        _id: '$_id',
                        id_reservasi: '$id_reservasi',
                        total: '$total',
                        ketua: 'nana',
                        check_in: { $ifNull: ['$check_in', '-'] },
                        check_out: { $ifNull: ['$check_out', '-'] },
                        status_pembayaran: '$status_pembayaran',
                        metode_pembayaran: '$metode_pembayaran',
                        // createdAt: '$createdAt',
                        // Menambahkan kolom baru untuk formatted_tanggal_pendakian
                        tanggal_pendakian: {
                            $dateToString: {
                                format: '%d-%m-%Y',
                                date: '$tanggal_pendakian'
                            }
                        },
                    },
                },
            ]);
    
            return response.successOK(res, 'Order history retrieved successfully', pendingReservasi);
        } catch (err) {
            next(err);
        }
    },
    
    allReservasi: async (req, res, next) => {
        try {
            const status = req.query.status;// Menggunakan id pengguna dari token JWT
            
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
                    tanggal_pendakian: order.tanggal_pendakian,
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
    
            return response.successOK(res, 'All data Pendakian', allreservasi);
        }catch(err) {
            next(err)
        }
    },

    monthlyTotal: async (req, res, next) => {
        try {
            const status = "completed";
            
            const bulan = req.query.bulan;
            const tahun = req.query.tahun;
            
            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }
            
            // Ambil semua data reservasi yang berhasil
            const successReservasi = await Order.find({
                status_pembayaran: status,
                tanggal_pendakian: {
                    $gte: new Date(`${tahun}-${bulan}-01`),
                    $lt: new Date(`${tahun}-${parseInt(bulan) + 1}-01`)
                },
            });
            
            // Objek respons yang mencakup informasi yang ingin ditampilkan
            const dataSummary = successReservasi.map(order => {
                return {
                    _id: order._id,
                    id_reservasi: order.id_reservasi,
                    total: order.total,
                    ketua: 'nana',
                    check_in: order.check_in || '-',
                    check_out: order.check_out || '-',
                    tanggal_pendakian: order.tanggal_pendakian,
                    status_pembayaran: order.status_pembayaran,
                    metode_pembayaran: order.metode_pembayaran,
                };
            });
            
            // Hitung total dari semua 'total' di dalam dataSummary
            const monthlyTotal = dataSummary.reduce((acc, order) => acc + order.total, 0);
    
            return response.successOK(res, 'Order history retrieved successfully', { dataSummary, monthlyTotal });
        } catch (err) {
            next(err);
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

            console.log('azil', order.id_user);

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
                tanggal_pendakian: order.tanggal_pendakian,
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

            // console.log(order.id_user);

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

            // Periksa apakah order sudah check-in atau check-out
            if (order.check_in === null) {
                return response.errorBadRequest(res, 'Order has already been checked in', null);
            }
        
            // Periksa apakah status pembayaran adalah "pending"
            if (order.status_pembayaran === 'pending') {
                return response.errorBadRequest(res, 'Order payment status is not pending', null);
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

    reservasiToday: async (req, res, next) => {
        try {
            const status = req.query.status;
    
            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }
    
            // Dapatkan tanggal saat ini
            const today = moment().startOf('day').toDate();
    
            // Cari semua order yang memiliki status_pembayaran 'pending' dan tanggal_pendakian sama dengan tanggal hari ini
            const pendingReservasi = await Order.aggregate([
                {
                    $match: {
                        status_pembayaran: status,
                        // Menambahkan filter tanggal_pendakian untuk hari ini
                        tanggal_pendakian: { $gte: today, $lt: moment(today).add(1, 'days').toDate() },
                    },
                },
                {
                    $project: {
                        _id: '$_id',
                        id_reservasi: '$id_reservasi',
                        total: '$total',
                        ketua: 'nana',
                        check_in: { $ifNull: ['$check_in', '-'] },
                        check_out: { $ifNull: ['$check_out', '-'] },
                        status_pembayaran: '$status_pembayaran',
                        metode_pembayaran: '$metode_pembayaran',
                        // createdAt: '$createdAt',
                        // Menambahkan kolom baru untuk formatted_tanggal_pendakian
                        tanggal_pendakian: {
                            $dateToString: {
                                format: '%d-%m-%Y',
                                date: '$tanggal_pendakian'
                            }
                        },
                    },
                },
            ]);
    
            return response.successOK(res, 'Order history retrieved successfully', pendingReservasi);
        } catch (err) {
            next(err);
        }
    },
    
}

