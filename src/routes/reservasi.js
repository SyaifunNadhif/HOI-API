const router = require("express").Router();
const {reservasi} = require('../controllers');
const jwt = require('../middlewares/barier');

router.post('/booking/:id_mount', jwt.protected, reservasi.createReservation);
router.get('/getdata/:id_book', jwt.protected, reservasi.getDataReservation);
router.post('/addanggota/:id_book', jwt.protected, reservasi.addAnggota);
router.post('/checkout/:id_book', jwt.protected, reservasi.checkout);
router.get('/cekuser/',  reservasi.cekUser);


module.exports = router;