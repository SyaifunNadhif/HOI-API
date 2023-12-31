const response = require('../utils/response');
const {User, Reservasi} = require('../db/models/');


module.exports = {
    bookMountTrip: async (req, res, next) => {
        try {
            const { user } = req;
            const id_user = user.id;
            console.log(id_user);
            const {check_in, check_out, jumlah_pendaki } = req.body;
            const id_mount = req.params.idmount;
            // Temukan pengguna yang melakukan reservasi
            const user_book = await User.findOne({ _id: id_user });
            if (!user_book) {
                return response.errorBadRequest(res, 'User not found');
            }
            // Buat reservasi
            const reservation = new Reservasi({
                user: user.id,
                mount: id_mount, 
                check_in,
                check_out,
                jumlah_pendaki,
            });
        
            // Jika jumlah_pendaki lebih dari 1, tambahkan pengguna sebagai anggota_pendaki
            // if (jumlah_pendaki > 1) {
            //     reservation.anggota_pendaki.push({ username });
            // }
            console.log(reservation);
        
            // await reservation.save();
            return response.successOK(res, "You have made a reservation, let's continue payment", reservation);
        }catch (e){
            next(e);
        }
    },

    
}


  