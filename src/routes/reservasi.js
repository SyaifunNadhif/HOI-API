const router = require("express").Router();
const {reservasi} = require('../controllers');
const jwt = require('../middlewares/barier');

router.post('/booking/:id_mount', jwt.protected, reservasi.createReservasi);
router.get('/getdata/:id_book', jwt.protected, reservasi.getDataReservasi);
router.post('/addanggota/:id_book', jwt.protected, reservasi.addAnggota);
router.get('/cekuser/',  reservasi.cekUser);


module.exports = router;