const response = require('../utils/response');
const {Reservasi, Mount, User} = require('../db/models/');


module.exports = {
    createReservasi: async (req, res, next) => {
        try {
            const { total, jumlah_pendaki, tanggal_pendakian, durasi_pendakian } = req.body;
            const { user } = req;
            const id_user = user.id; 
            console.log("id_user", id_user);
            const {id_mount} = req.params;
            console.log("id_mount",id_mount);

            console.log(typeof(id_mount))

            


            // Check apakah id_user benar atau tidak
            const userExists = await User.exists({ _id: id_user });
            if (!userExists) {
                return res.status(404).json(response.error('User not found'));
            }
            const mount = await Mount.exists({ _id: id_mount });
            if (!mount) {
                return res.status(404).json(response.error('Mount not found'));
            }
            
            // Logika untuk membuat reservasi
            const reservasi = new Reservasi({
                user_id: id_user,
                mount_id: id_mount,
                total,
                jumlah_pendaki,
                tanggal_pendakian,
                durasi_pendakian,
                anggota_pendaki: [id_user],
            });

            await reservasi.save();

            return response.successCreated(res,'Reservasi created successfully', reservasi);
        } catch (e) {
            next(e);
        }
    }, 
    
    getDataReservasi: async (req, res, next) => {
        try {
            const id_book = req.params.id_book;
    
            // Cari data reservasi berdasarkan id_book
            const reservasi = await Reservasi.findById(id_book);
            if (!reservasi) {
                return res.status(404).json(response.error('Reservation not found'));
            }
    
            // Dapatkan data user berdasarkan user_id dalam reservasi
            const user = await User.findById(reservasi.user_id);
            if (!user) {
                return res.status(404).json(response.error('User not found'));
            }
    
            // Dapatkan data mount berdasarkan mount_id dalam reservasi
            const mount = await Mount.findById(reservasi.mount_id);
            if (!mount) {
                return res.status(404).json(response.error('Mount not found'));
            }
    
            // Siapkan payload respons yang mencakup data reservasi, user, dan mount
            const payload = {
                jumlah_pendaki: reservasi.jumlah_pendaki,
                tanggal_pendakian: reservasi.tanggal_pendakian,
                durasi_pendakian: reservasi.durasi_pendakian,
                anggota_pendaki: reservasi.anggota_pendaki,
                name: user.name,
                email: user.email,
                gunung: mount.name,
                tiket: mount.ticket_price,
                basecamp: mount.basecamp

            }
        
    
            // Kembalikan respons sukses bersama dengan payload
            return response.successOK(res, 'Reservasi get successfully', payload);
        } catch (e) {
            next(e);
        }
    },

    addAnggota: async (req, res, next) => {
        try {
            const id_book = req.params.id_book;
    
            // Cari data reservasi berdasarkan id_book
            const reservasi = await Reservasi.findById(id_book);
            if (!reservasi) {
                return res.status(404).json(response.error('Reservation not found'));
            }
    
            // Dapatkan data user berdasarkan user_id dalam reservasi
            const user = await User.findById(reservasi.user_id);
            if (!user) {
                return res.status(404).json(response.error('User not found'));
            }
    
            // Dapatkan jumlah anggota pendaki yang sudah ada
            const jumlahAnggotaSaatIni = reservasi.anggota_pendaki.length;
    
            // Dapatkan ID pengguna baru dari req.body (contoh: ["id_user_1", "id_user_2"])
            const id_anggota_baru = req.body.id_anggota_baru;
    
            // Validasi ID anggota baru
            if (!id_anggota_baru || !Array.isArray(id_anggota_baru)) {
                return res.status(400).json(response.error('Invalid array of user IDs'));
            }
    
            // Hitung jumlah anggota pendaki yang diinginkan
            const totalAnggotaBaru = jumlahAnggotaSaatIni + id_anggota_baru.length;
    
            // Cek apakah masih bisa menambah anggota pendaki
            const maksimumAnggota = reservasi.jumlah_pendaki; // Gantilah dengan jumlah maksimum anggota yang diizinkan
            if (totalAnggotaBaru > maksimumAnggota) {
                return res.status(400).json(response.error('Total number of members exceeds the limit'));
            }
    
            // Tambahkan anggota pendaki baru ke dalam array anggota_pendaki
            reservasi.anggota_pendaki.push(...id_anggota_baru);
    
            // Simpan perubahan ke dalam database
            await reservasi.save();
    
            return response.successOK(res, 'Additional members added successfully', reservasi );
        } catch (e) {
            next(e);
        }
    }
    
}


  