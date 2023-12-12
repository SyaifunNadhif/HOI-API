const imagekit = require('../utils/imageKit');
const crypto = require("crypto");
const path = require("path");

module.exports = {
    strogeSingle: (req, res) => {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                image_url: imageUrl
            }
        });
    },

    storageArray: (req, res) => {
        const imageUrls = [];
        req.files.forEach(file => {
            imageUrls.push(`${req.protocol}://${req.get('host')}/images/${file.filename}`);
        });

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                image_urls: imageUrls
            }
        });
    },

    imagekitUpload: async (req, res) => {
        try {
            const stringFile = req.file.buffer.toString('base64');

            const uploadFile = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            });

            return res.json({
                status: true,
                message: 'success',
                data: {
                    name: uploadFile.name,
                    url: uploadFile.url,
                    type: uploadFile.fileType
                }
            });
        } catch (err) {
            throw err;
        }
    },

    uploadAvatar: async (req, res, next) => {
		try {
			const user = req.user;
			
			if(!req.get("Content-Type").includes("multipart/form-data")) {
				return next();
			}

			const filename = `${user.fullname}_${crypto.randomBytes(8).toString("hex").toLowerCase()}${path.extname(req.file.originalname)}`;

			const imageString = req.file.buffer.toString("base64");

			const uploadFile = await imagekit.upload({
				fileName: filename,
				file: imageString,
				folder: "HOI-API/avatar",
				useUniqueFileName: false,
				overwriteFile: true,
			});

			req.uploadFile = {
				imageUrl: uploadFile.url,
			};
            
			return next();
		} catch (error) {
			return next(error);
		}
	},

    uploadMountPhotos: async (req, res, next) => {
        try {
            const name = req.body.name; // Sesuaikan dengan nama field di form Anda
            const photos = req.files.map(file => ({ buffer: file.buffer }));
        
            const uploadedPhotos = await Promise.all(
                photos.map(async photo => {
                const imageString = photo.buffer.toString('base64');
                const uploadFile = await imagekit.upload({
                    fileName: `${name}_${Date.now()}`,
                    file: imageString,
                    folder: 'mounts',
                    useUniqueFileName: false,
                    overwriteFile: true,
                });
                return { url: uploadFile.url };
                })
            );
        
            // Menambahkan data foto yang diunggah ke objek req untuk digunakan di controller
            req.uploadedPhotos = uploadedPhotos;
        
            next();
        } catch (e) {
            next(e);
        }
    },

    createProfile: async (req, res) => {
        try {
          const { name, email, bio } = req.body;
          const photo = req.file;
      
          const uploadResponse = await imagekit.upload({
            file: photo.buffer.toString('base64'),
            fileName: photo.originalname,
          });
      
          const photoUrl = uploadResponse.url;
      
          // Lakukan apa yang diperlukan dengan data dan URL foto
          // (Contoh: menyimpan data ke database)
      
          res.json({ success: true, photoUrl, name, email, bio });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    },
    
};