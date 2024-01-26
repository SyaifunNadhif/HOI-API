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
    }
}