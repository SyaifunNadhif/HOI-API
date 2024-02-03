const router = require("express").Router();
const {notif} = require('../controllers');
const jwt = require('../middlewares/barier');



// router.get('/data', jwt.protected, auth.whoami);


module.exports = router;