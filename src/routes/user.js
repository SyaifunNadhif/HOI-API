const router = require("express").Router();
const {user} = require('../controllers');

router.post('/', user.user);
module.exports = router;