const router = require("express").Router();
const multer = require("multer");
const {post} = require('../controllers');
const middlewares = require('../middlewares/requireLogin');
const upload = multer();

router.post('/', middlewares.protected, post.createPost);
router.post('/createpost', middlewares.protected, upload.single('photo'), post.createPost);
router.get('/allpost', post.allPost);
router.get('/category/:category', post.allPostCategory)
router.get('/mypost', middlewares.protected, post.myPosts);
router.post('/likepost/:postId', middlewares.protected, post.likeUnlikePost);
router.post('/comment/:postId', middlewares.protected, post.createCommentPost);
router.get('/detail/:postId', post.getDetailPost);
router.get('/delpost/:postId', middlewares.protected, post.deletePost);
router.get('/deletecomment/:postId/:commentId', middlewares.protected, post.deleteComment);

module.exports = router;