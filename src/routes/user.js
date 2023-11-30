const router = require("express").Router();
const {user} = require('../controllers');
const middlewares = require('../middlewares/requireLogin');

router.post('/', user.user);
router.post('/follow/:userIdToFollow', middlewares.protected, user.follow);
router.post('/unfollow/:userIdToUnfollow', middlewares.protected, user.unfollow);
router.get('/search', user.searchUser);
router.get('/userprofile/:userId', user.getUserProfile);
module.exports = router;