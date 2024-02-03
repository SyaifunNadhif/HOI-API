const router = require("express").Router();
const {admin, order} = require('../controllers');
const jwt = require('../middlewares/barier');
// const middlewares = require('../middlewares/requireLogin');



router.get('/reservasipending/', jwt.protected, admin.pendingReservasi);
router.get('/reservasisuccess/', jwt.protected, admin.successReservasi);
router.get('/reservasitoday/', jwt.protected, admin.reservasiToday);
router.get('/alldata/', jwt.protected, admin.allReservasi);
router.get('/detailreservasi/:orderid', admin.detail);
router.put('/check-in/:orderid', jwt.protected, admin.checkIn);
router.put('/check-out/:orderid', jwt.protected, admin.checkOut);
// router.get('/detailreservasi/:orderid', admin.detail);

module.exports = router;