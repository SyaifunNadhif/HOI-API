const router = require("express").Router();
const {reservasi} = require('../controllers');
const jwt = require('../middlewares/requireLogin');

router.post('/bookmount/:idmount', jwt.protected, reservasi.bookMountTrip);


module.exports = router;