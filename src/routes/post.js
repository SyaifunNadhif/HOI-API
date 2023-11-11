const router = require("express").Router();
const {post} = require('../controllers');
const middlewares = require('../middlewares/requireLogin');

router.post('/', middlewares.protected, post.createPost);
router.get('/allpost', post.allPost);
router.get('/category/:category', post.allPostCategory)
router.get('/mypost', middlewares.protected, post.myPosts);
router.post('/likepost/:postId', middlewares.protected, post.likeUnlikePost);
router.post('/comment/:postId', middlewares.protected, post.createCommentPost);
router.get('/detail/:postId', post.getDetailPost);

module.exports = router;