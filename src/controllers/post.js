const response = require('../utils/response');
const {Post} = require('../db/models/'); 


module.exports = {
    createPost: async (req, res, next) => {
        try {
            const {category, caption} = req.body;
            if(!category || !caption){
                return response.errorEntity(res, "Invalid credentials!", "Please add all the fields");
            }

            const { id, name, email } = req.user; 
            
            const newPost = new Post({
                category,
                caption,
                postedBy: {
                    _id: id,
                    name: name,
                    email: email,
                }
            });

            await newPost.save();

            // Memasukkan informasi pengguna dalam objek respons
            const responsePost = {
                category: newPost.category,
                caption: newPost.caption,
                postedBy: {
                    _id: id,
                    name,
                    email,
                },
                _id: newPost._id,
                __v: newPost.__v,
            };

        return response.successOK(res, "Post created successfully", responsePost);
        } catch (e) {
            next(e);
        }
    },

    myPosts: async (req, res, next) => {
        try {
            const myposts = await Post.find({ postedBy: req.user.id })
                .populate('postedBy', '_id name email')
                .exec();
            return response.successOK(res, 'Your posts retrieved successfully', myposts);
        } catch (e) {
            next(e);
        }
    },

    allPost: async (req, res, next) => {
        try{
            const posts = await Post.find().populate("postedBy", "_id name email");

            return response.successOK(res, "All posts retrieved successfully", posts);
        }catch (e){
            next(e);
        }
    },

    allPostCategory: async (req, res, next) => {
        try {
            const { category } = req.params;
            console.log("Category:", category); // Untuk debugging

            // Mengambil semua postingan dengan kategori yang sesuai
            const posts = await Post.find({ category })
                .populate('postedBy', '_id name email')
                .exec();
            
            return response.successOK(res, `All posts in the "${category}" category retrieved successfully`, posts);
        } catch (e) {
            next(e);
        }
    },

    likePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { user } = req;

            // Cari postingan berdasarkan ID
            const post = await Post.findById(postId);

            if (!post) {
                return response.errorUnauthorized(res, "Post not found");
            }

            // Periksa apakah pengguna sudah memberikan "like" pada postingan ini
            if (post.likes.includes(user.id)) {
                return response.errorUnauthorized(res, "You have already liked this post");
            }

            // Tambahkan "like" pengguna ke postingan
            post.likes.push(user.id);
            await post.save();

            return response.successOK(res, "You have liked the post", );
        } catch (e) {
            next(e);
        }
    },

    likeUnlikePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { user } = req;

            // Cari postingan berdasarkan ID
            const post = await Post.findById(postId);

            if (!post) {
                return response.errorNotFound(res, "Post not found");
            }

            // Periksa apakah pengguna sudah memberikan "like" pada postingan ini
            const hasLiked = post.likes.includes(user.id);

            if (hasLiked) {
                // Pengguna telah memberikan "like," maka sekarang akan "unlike"
                const index = post.likes.indexOf(user.id);
                post.likes.splice(index, 1);
            } else {
                // Pengguna belum memberikan "like," maka sekarang akan "like"
                post.likes.push(user.id);
            }

            await post.save();

            if (hasLiked) {
                return response.successOK(res, "You have unliked the post");
            } else {
                return response.successOK(res, "You have liked the post");
            }
        } catch (e) {
            next(e);
        }
    },

    createCommentPost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { text } = req.body;
            const { user } = req;

            // Cari postingan berdasarkan ID
            const post = await Post.findById(postId);

            if (!post) {
                return response.errorBadRequest(res, "Post not found");
            }

            // Buat objek komentar
            const comment = {
                text,
                postedBy: user.id,
            };

            // Tambahkan komentar ke postingan
            post.comments.push(comment);

            await post.save();

            return response.successOK(res, "Comment created successfully", comment);
        } catch (e) {
            next(e);
        }
    },

    getDetailPost: async (req, res, next) => {
        try {
            const { postId } = req.params;

            // Cari postingan berdasarkan ID dan populasi informasi pengguna yang mempostingnya
            const post = await Post.findById(postId).populate('postedBy', '_id name email');

            if (!post) {
                return response.errorBadRequest(res, "Post not found", null);
            }

            return response.successOK(res, "Post details retrieved successfully", post);
        } catch (e) {
            next(e);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;
            const { user } = req;

            // Cari postingan berdasarkan ID
            const post = await Post.findById(postId);

            if (!post) {
                return response.errorNotFound(res, "Post not found");
            }

            // Temukan indeks komentar yang akan dihapus
            const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

            if (commentIndex === -1) {
                return response.errorNotFound(res, "Comment not found");
            }

            // Periksa apakah pengguna yang mencoba menghapus komentar adalah pemilik postingan atau pemilik komentar
            if (post.postedBy.toString() !== user._id.toString() &&
                post.comments[commentIndex].postedBy.toString() !== user._id.toString()) {
                return response.errorUnauthorized(res, "You are not authorized to delete this comment");
            }

            // Hapus komentar dari array komentar postingan
            post.comments.splice(commentIndex, 1);

            await post.save();

            return response.successOK(res, "Comment deleted successfully");
        } catch (e) {
            next(e);
        }
    },
      
}

