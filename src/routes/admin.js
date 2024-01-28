const router = require("express").Router();
const {admin, order} = require('../controllers');
const jwt = require('../middlewares/barier');
// const middlewares = require('../middlewares/requireLogin');


// router.get('/', auth.getHello);
// router.post('/register', auth.register);
// router.post('/login', auth.login);
// router.get('/whoami', middlewares.protected ,auth.whoami);
// router.get('/data', jwt.protected, auth.whoami);
// router.get('/code', auth.generateCode);

router.get('/reservasipending', jwt.protected, admin.pendingReservasi);
router.get('/reservasisuccess', jwt.protected, admin.successReservasi);
router.get('/detailreservasi/:orderid', admin.detail);
router.put('/check-in/:orderid', jwt.protected, admin.checkIn);
router.put('/check-out/:orderid', jwt.protected, admin.checkOut);
// router.get('/detailreservasi/:orderid', admin.detail);

module.exports = router;