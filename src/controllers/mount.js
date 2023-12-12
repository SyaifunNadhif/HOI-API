const response = require('../utils/response');
const {Mount} = require('../db/models/'); 

module.exports = {
    addMount: async (req, res, next) => {
        try {
            // Cek apakah pengguna adalah admin
            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }

            const { name, ticketPrice, height, description, basecamp } = req.body;
            console.log(name);
            const photos = req.uploadedPhotos;
        
            // Membuat objek Mount baru
            const newMount = new Mount({
                name,
                ticketPrice,
                height,
                description,
                basecamp,
               
            
            });
        
            // Menyimpan objek Mount ke database
            const savedMount = await newMount.save();
        
            // Mengembalikan respons sukses bersama data Gunung yang telah ditambahkan
            return response.successOK(res, 'Mount added successfully', newMount);
        } catch (e) {
            // Menangani kesalahan jika terjadi
            return next(e);
        }
    },

    allMount: async (req, res, next) => {
        try {
          const mounts = await Mount.find();

          return response.successOK(res, 'All mounts retrieved successfullyy', mounts);
        } catch (error) {
          next(error);
        }
    },
    
    
};
