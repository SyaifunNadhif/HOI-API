const router = require("express").Router();
const multer = require("multer");
const {user, media} = require('../controllers');
const jwt = require('../middlewares/requireLogin');

const upload = multer();

router.post('/', user.user);
router.post('/follow/:userIdToFollow', jwt.protected, user.follow);
router.post('/unfollow/:userIdToUnfollow', jwt.protected, user.unfollow);
router.get('/search', user.searchUser);
router.get('/userprofile/:userId', user.getUserProfile);
router.post('/updateavatar/', upload.single("media"),  jwt.protected, media.uploadAvatar, user.updateAvatar);

router.post('/imagekit/upload', upload.single("media"), media.imagekitUpload);


router.post('/createProfile', upload.single('photo'), media.createProfile);

module.exports = router;