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

            // Check apakah id_user benar atau tidak
            const userExists = await User.exists({ _id: id_user });
            if (!userExists) {
                return res.status(404).json(response.error('User not found'));
            }

            // console.log(user);

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
                anggota_pendaki: [user.code],
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
    
            // Siapkan payload respons yang mencakup data reservasi, user, dan mount
            const payload = {
                anggota_pendaki: anggotaPendakiData,
                durasi_pendakian: reservasi.durasi_pendakian,
                jumlah_pendaki: reservasi.jumlah_pendaki,
                tanggal_pendakian: reservasi.tanggal_pendakian,
                total: reservasi.total,
                userBoking:{
                    code: user.code,
                    email: user.email,
                    name: user.name,
                    address: user.address,
                    phone: user.phone
                },
                mount : {
                    gunung: mount.name,
                    tiket: mount.ticket_price,
                    basecamp: mount.basecamp
                }

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

            const code_anggota_baru = req.body.code_anggota_baru;

            // Validasi Kode anggota baru
            if (!code_anggota_baru || !Array.isArray(code_anggota_baru)) {
                return response.errorNotFound(res, 'Invalid array of user codes');
            }

            // Cari pengguna berdasarkan kode
            const usersFound = await User.find({ code: { $in: code_anggota_baru } });

            // Pastikan semua kode anggota baru ada dalam database
            if (usersFound.length !== code_anggota_baru.length) {
                return response.errorNotFound(res,'One or more user codes not found');
                
            }

            // cek apakah code tersebut sudah masuk ke dalam anggota_pendaki pada tabel reservasi ini
            const existingMembers = reservasi.anggota_pendaki.filter(member => code_anggota_baru.includes(member));

            if (existingMembers.length > 0) {
                return response.errorNotFound(res,'One or more members already exist in the reservation');
            }

            // Tambahkan kode anggota baru ke dalam array anggota_pendaki
            reservasi.anggota_pendaki.push(...code_anggota_baru);

            // Simpan perubahan ke dalam database
            await reservasi.save();

            // Ambil data reservasi setelah perubahan
            const reservasiUpdated = await Reservasi.findById(id_book).populate('anggota_pendaki');
    
            return response.successOK(res, 'Additional members added successfully', reservasiUpdated);
        } catch (e) {
            next(e);
        }
    },

    cekUser: async (req, res, next) => {
        try {
            const { code } = req.params;

            // code = code.toUpperCase();

            // console.log(code); // Output: PGU-2410

    
            // Cek apakah code itu ada di table User
            const user = await User.findOne({ code });
    
            if (!user) {
                return res.status(404).json(response.error('User not found'));
            }

            const payload = {
                code: user.code,
                name: user.name,
                email: user.email,
                address: user.address
            }
    
            // Jika user ditemukan, kirim respons dengan data user
            return response.successOK(res, 'Get User Successfully', payload);
        } catch (e) {
            next(e);
        }
    },

    checkout: async (req, res, next) => {
        
    },
    
    
}


  