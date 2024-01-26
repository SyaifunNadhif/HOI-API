const router = require("express").Router();
const multer = require("multer");
const {user, media} = require('../controllers');
const jwt = require('../middlewares/requireLogin');
const tkn = require('../middlewares/barier');

const upload = multer();

router.post('/', user.user);
router.post('/follow/:userIdToFollow', jwt.protected, user.follow);
router.post('/unfollow/:userIdToUnfollow', jwt.protected, user.unfollow);
router.get('/myprofile', jwt.protected, user.myProfile);
router.get('/search', user.searchUser);
router.get('/userprofile/:userId', user.getUserProfile);
router.post('/updateavatar/', upload.single("media"),  jwt.protected, media.uploadAvatar, user.updateAvatar);
router.post('/imagekit/upload', upload.single("media"), media.imagekitUpload);
router.post('/createProfile', upload.single('photo'), media.createProfile);

// pendakian gunung
router.get('/getmyprofile/', tkn.protected, user.getMyProfile);
router.put('/editprofile/', tkn.protected, user.updateProfile);

module.exports = router;