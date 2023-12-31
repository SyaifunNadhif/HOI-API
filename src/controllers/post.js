const response = require('../utils/response');
const {Post} = require('../db/models/');
const timeago = require('timeago.js');
const imagekit = require('../utils/imageKit');



module.exports = {
    allPost: async (req, res, next) => {
        try {
            const posts = await Post.find().populate("postedBy", "_id name avatar");

            // Format waktu menggunakan timeago
            const postsWithRelativeTime = posts.map(post => {
                const createdAt = post.createdAt;

                // Hitung selisih waktu antara sekarang dan waktu pembuatan postingan
                const relativeTime = timeago.format(createdAt, 'en_short');
                console.log(relativeTime);
                // Tambahkan atribut baru ke postingan
                post.relativeTime = relativeTime;

                return post;
            });

            return response.successOK(res, "All posts retrieved successfully", postsWithRelativeTime);
        } catch (e) {
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

    createPost: async (req, res, next) => {
        try {
            const {category, caption} = req.body;
            let photo = req.file;
            if(!category || !caption){
                return response.errorEntity(res, "Invalid credentials!", "Please add all the fields");
            }

            const uploadResponse = await imagekit.upload({
                file: photo.buffer.toString('base64'),
                fileName: photo.originalname,
              });
          
            photo = uploadResponse.url;

            const { id, name, email } = req.user; 
            
            const newPost = new Post({
                category,
                caption,
                photo,
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
                photo: newPost.photo,
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

    myPosts: async (req, res, next) => {
        try {
            const { user } = req;
            // Cari postingan berdasarkan ID pengguna
            const myposts = await Post.find({ postedBy: user.id })
                .populate('postedBy', '_id name email')
                .exec();

            return response.successOK(res, 'Your posts retrieved successfully', myposts);
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

    getDetailPost: async (req, res, next) => {
        try {
            const { postId } = req.params;

            // Cari postingan berdasarkan ID dan populasi informasi pengguna yang mempostingnya
            const post = await Post.findById(postId).populate('postedBy', '_id name email');
    
            if (!post) {
                return response.errorBadRequest(res, "Post not found", null);
            }
    
            // Format waktu menggunakan timeago
            const createdAt = post.createdAt;
            const relativeTime = timeago.format(createdAt, 'en_short');
            console.log(relativeTime);
    
            // Tambahkan atribut baru ke postingan
            post.relativeTime = relativeTime;
    
            return response.successOK(res, "Post details retrieved successfully", post);
        } catch (e) {
            next(e);
        }
    },

    deletePost: async (req, res, next) => {
        try {
            const post = await Post.findOne({ _id: req.params.postId }).populate('postedBy', '_id').exec();
    
            if (!post) {
                return response.errorNotFound(res, 'Post not found');
            }
    
            if (post.postedBy._id.toString() !== req.user.id.toString()) {
                return response.errorUnauthorized(res, 'You are not authorized to delete this post');
            }
    
            await post.deleteOne(); // Menggunakan deleteOne() untuk menghapus
    
            return response.successOK(res, 'Post deleted successfully');
        } catch (e) {
            next(e);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;

            const post = await Post.findById(postId).populate('comments.postedBy', '_id');

            if (!post) {
                return response.errorNotFound(res, 'Post not found');
            }

            // Temukan komentar yang akan dihapus
            const comment = post.comments.find(comment => comment._id.toString() === commentId);

            if (!comment) {
                return response.errorNotFound(res, 'Comment not found');
            }

            // Pastikan hanya pemilik komentar atau pemilik postingan yang dapat menghapus
            if (comment.postedBy._id.toString() !== req.user.id.toString() && post.postedBy._id.toString() !== req.user.id.toString()) {
                return response.errorUnauthorized(res, 'You are not authorized to delete this comment');
            }

            // Hapus komentar dari array komentar pada postingan
            post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
            await post.save();

            return response.successOK(res, 'Comment deleted successfully');
        } catch (e) {
            console.error(error);
            next(e);
        }
    },

    create: async (req, res, next) => {
        try {
            const {category, caption, post} = req.body;
            if(!category || !caption){
                return response.errorEntity(res, "Invalid credentials!", "Please add all the fields");
            }

            if(!post || !Array.isArray(post) || post.length === 0){
                return response.errorEntity(res, "Invalid credentials!", "Please add at least one photo or video");
            }

            // Mengecek tipe data dan ukuran setiap elemen di post
            for(let i = 0; i < post.length; i++){
                let element = post[i];
                // Jika elemen adalah string, maka harus berupa URL yang valid
                if(typeof element === "string"){
                    if(!isValidURL(element)){
                        return response.errorEntity(res, "Invalid credentials!", `Please provide a valid URL for photo or video at index ${i}`);
                    }
                }
                // Jika elemen adalah object, maka harus memiliki properti url yang valid dan properti lain yang opsional
                else if(typeof element === "object"){
                    if(!element.url || !isValidURL(element.url)){
                        return response.errorEntity(res, "Invalid credentials!", `Please provide a valid URL for photo or video at index ${i}`);
                    }
                    // Mengecek ukuran file jika ada
                    if(element.size && element.size > MAX_FILE_SIZE){
                        return response.errorEntity(res, "Invalid credentials!", `Please provide a photo or video with size less than ${MAX_FILE_SIZE} bytes at index ${i}`);
                    }
                }
                // Jika elemen bukan string atau object, maka invalid
                else{
                    return response.errorEntity(res, "Invalid credentials!", `Please provide a string or object for photo or video at index ${i}`);
                }
            }

            const { id, name, email } = req.user; 
            
            const newPost = new Post({
                category,
                caption,
                post,
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
                post: newPost.post,
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
    
 
}

