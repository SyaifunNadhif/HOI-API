const router = require("express").Router();
const multer = require("multer");
const {mount, media} = require('../controllers');
const jwt = require('../middlewares/requireLogin');
const {imagekit} = require('../utils/imageKit');


// Konfigurasi Multer untuk menangani upload file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// const upload = multer();

// router.post('/addmount/', upload.array('photos', 3), jwt.protected, media.uploadMountPhotos, mount.addMount);
// router.post('/addmount/',  jwt.protected, mount.addMount);

// upload 2 photos mount
router.post('/addmount/', jwt.protected, upload.array('photo', 2), media.uploadPhotos, mount.createMount);
router.get('/allmount/', mount.allMount);

// Endpoint untuk membuat data
// router.post('/create', upload.single('image'), async (req, res) => {
//     try {
//       // Mendapatkan data dari body form
//       const { name, desc, price } = req.body;
  
//       // Mendapatkan file gambar dari request
//       const image = req.file;
  
//       // Upload file gambar ke ImageKit
//       const uploadResponse = await imagekit.upload({
//         file: image.buffer.toString('base64'),
//         fileName: image.originalname,
//       });
  
//       // Dapatkan URL gambar yang diunggah
//       const imageUrl = uploadResponse.url;
  
//       // Lakukan apa yang diperlukan dengan data dan URL gambar
//       // (Contoh: menyimpan data ke database)
  
//       // Kirim respons ke klien
//       res.json({ success: true, imageUrl });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
//   });


module.exports = router;