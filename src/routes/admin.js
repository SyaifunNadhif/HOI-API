const router = require("express").Router();
const {admin} = require('../controllers');
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

module.exports = router;