const router = require("express").Router();
const {auth} = require('../controllers');
const middlewares = require('../middlewares/requireLogin');
const jwt = require('../middlewares/barier');


router.get('/', auth.getHello);
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/whoami', middlewares.protected ,auth.whoami);
router.get('/data', jwt.protected, auth.whoami);

module.exports = router;