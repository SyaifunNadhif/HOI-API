const router = require("express").Router();
const {auth} = require('../controllers');
const protected = require('../middlewares/requireLogin');


router.get('/', auth.getHello);
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/whoami', protected.auth ,auth.whoami);

module.exports = router;