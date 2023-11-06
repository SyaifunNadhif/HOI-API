const router = require("express").Router();
const {post} = require('../controllers');
const middlewares = require('../middlewares/requireLogin');

router.post('/', middlewares.protected, post.createPost);
router.get('/allpost', post.allPost);
router.get('/mypost', middlewares.protected, post.myPosts);

module.exports = router;