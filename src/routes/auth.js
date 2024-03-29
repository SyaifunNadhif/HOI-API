const router = require("express").Router();
const {auth} = require('../controllers');
const middlewares = require('../middlewares/requireLogin');
const jwt = require('../middlewares/barier');


router.get('/', auth.getHello);
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/whoami', jwt.protected ,auth.whoami);
router.get('/data', jwt.protected, auth.whoami);
// router.get('/code', auth.generateCode);

module.exports = router;