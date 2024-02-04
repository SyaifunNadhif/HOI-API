const router = require("express").Router();
const {admin} = require('../controllers');
const jwt = require('../middlewares/barier');




router.get('/reservasinext/', jwt.protected, admin.reservasiNext);
router.get('/monthlyreservations/', jwt.protected, admin.monthlyTotal);
router.get('/reservasitoday/', jwt.protected, admin.reservasiToday);
router.get('/alldata/', jwt.protected, admin.allReservasi);
router.get('/detailreservasi/:orderid', admin.detail);
router.put('/check-in/:orderid', jwt.protected, admin.checkIn);
router.put('/check-out/:orderid', jwt.protected, admin.checkOut);
// router.get('/detailreservasi/:orderid', admin.detail);

module.exports = router;