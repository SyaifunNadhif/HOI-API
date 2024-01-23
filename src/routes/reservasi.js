const router = require("express").Router();
const {reservasi} = require('../controllers');
const jwt = require('../middlewares/barier');

router.post('/booking/:id_mount', jwt.protected, reservasi.createReservasi);
router.get('/getdata/:id_book', jwt.protected, reservasi.getDataReservasi)


module.exports = router;