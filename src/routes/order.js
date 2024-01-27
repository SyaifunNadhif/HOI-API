const router = require("express").Router();
const {order} = require('../controllers');
const middlewares = require('../middlewares/requireLogin');
const jwt = require('../middlewares/barier');



router.get('/history/', jwt.protected, order.history);
router.get('/detail/:orderid', jwt.protected, order.detail);
router.get('/cancel/:orderid', jwt.protected, order.cancel);

module.exports = router;