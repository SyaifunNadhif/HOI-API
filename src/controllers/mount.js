const response = require('../utils/response');
const {Mount} = require('../db/models/'); 

module.exports = {
    allMount: async (req, res, next) => {
        try {
          const mounts = await Mount.find();

          return response.successOK(res, 'All mounts retrieved successfullyy', mounts);
        } catch (error) {
          next(error);
        }
    },

    createMount: async (req, res, next) => {
        try{
            const { name, ticket_price, height, description, basecamp } = req.body;
            console.log(req.uploadedPhotos);
            const uploadedPhotos = req.uploadedPhotos;


            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }
    
            // Upload each photo to ImageKit
            const newMount = new Mount({
                name,
                ticket_price: +ticket_price,
                height: +height,
                description,
                basecamp,
                photo: uploadedPhotos.map(photo => photo.url),
              });
    
             // Menyimpan objek Mount ke database
             await newMount.save();
        
             // Mengembalikan respons sukses bersama data Gunung yang telah ditambahkan
             return response.successCreated(res, 'Mount added successfully', newMount);
        }catch(e){
            next(e);
        }
    },
    
    
};
