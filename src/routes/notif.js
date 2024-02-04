const router = require("express").Router();
const {notif} = require('../controllers');
const jwt = require('../middlewares/barier');



router.get('/alldata', jwt.protected, notif.index);
router.put('/alldata/:id', jwt.protected, notif.readNotif);


module.exports = router;