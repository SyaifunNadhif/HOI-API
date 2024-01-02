const response = require('../utils/response');
const {Post, User} = require('../db/models/');
const timeago = require('timeago.js');
const imagekit = require('../utils/imageKit');
const tinify = require('tinify');
const Jimp = require('jimp');

// Set your TinyPNG/TinyJPG API key
tinify.key = 'KF9Prl0xC47TJgN6h35WYtbx5Qc2Ps3b';




module.exports = {
    allPost: async (req, res, next) => {
        try {
            // Ambil semua postingan, diurutkan berdasarkan createdAt secara menurun
            const posts = await Post.find().sort({ createdAt: -1 }).populate("postedBy", "_id name avatar");
    
            // Format waktu menggunakan timeago
            const payloadAllpost = await Promise.all(posts.map(async (post) => {
                const createdAt = post.createdAt;
    
                // Hitung selisih waktu antara sekarang dan waktu pembuatan postingan
                const relativeTime = timeago.format(createdAt, 'en_short');
    
                // Tambahkan atribut baru ke postingan
                post.relativeTime = relativeTime;
    
                // Ambil informasi pengguna dari model User untuk setiap komentar
                post.comments = await Promise.all(post.comments.map(async (comment) => {
                    // Ambil informasi pengguna dari model User berdasarkan ID
                    const user = await User.findById(comment.postedBy);
    
                    // Update objek comment dengan informasi pengguna jika user ditemukan
                    if (user) {
                        comment.user = {
                            _id: user._id,
                            name: user.name,
                            avatar: user.avatar,
                        };
                    }

                    // console.log(comment.user);
    
                    return comment;
                }));

                const payload = ({
                    _id: post._id,
                    category: post.category,
                    caption: post.caption,
                    time: post.relativeTime,
                    photo: post.photo,
                    likes: post.likes,
                    postedBy: post.postedBy
                        ? {
                              _id: post.postedBy._id,
                              name: post.postedBy.name,
                              avatar: post.postedBy.avatar,
                          }
                        : null,
                    comments: post.comments.map(comment => ({
                        _id: comment._id,
                        text: comment.text,
                        postedBy: comment.postedBy,
                        user: comment.user
                            ? {
                                  _id: comment.user._id,
                                  name: comment.user.name,
                                  avatar: comment.user.avatar,
                              }
                            : null,
                    })),
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    __v: post.__v,
                });
    
                return payload;
            }));
            
            
    
            return response.successOK(res, "All posts retrieved successfully", payloadAllpost);
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
                .populate('postedBy', '_id name avatar')
                .exec();
            
            return response.successOK(res, `All posts in the "${category}" category retrieved successfully`, posts);
        } catch (e) {
            next(e);
        }
    },

    createPost: async (req, res, next) => {
        try {
            const { category, caption } = req.body;
            let photo = req.file;
            if (!category || !caption) {
                return response.errorEntity(res, "Invalid credentials!", "Please add all the fields");
            }
    
            // Resize gambar
            const resizedImageBuffer = await Jimp.read(photo.buffer)
            .then(image => image.resize(800, Jimp.AUTO).getBufferAsync(Jimp.AUTO));
        
            // Kompresi agresif menggunakan Tinify secara asinkron
            const tinifyBuffer = await tinify.fromBuffer(resizedImageBuffer).toBuffer();
            
            // Proses unggah gambar ke ImageKit
            const uploadResponse = await imagekit.upload({
                file: tinifyBuffer.toString('base64'),
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
                    name,
                    email,
                },
            });
    
            await newPost.save();
    
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
            const post = await Post.findById(postId).populate('postedBy', '_id name avatar').populate('comments.postedBy', '_id name avatar');
    
            if (!post) {
                return response.errorBadRequest(res, "Post not found", null);
            }
    
            // Format waktu menggunakan timeago
            const createdAt = post.createdAt;
            const relativeTime = timeago.format(createdAt, 'en_short');
            console.log(relativeTime);
    
            // Tambahkan atribut baru ke postingan
            post.relativeTime = relativeTime;

            const payload = ({
                _id: post._id,
                category: post.category,
                caption: post.caption,
                time: post.relativeTime,
                photo: post.photo,
                likes: post.likes,
                postedBy: post.postedBy
                    ? {
                          _id: post.postedBy._id,
                          name: post.postedBy.name,
                          avatar: post.postedBy.avatar,
                      }
                    : null,
                comments: post.comments.map(comment => ({
                    _id: comment._id,
                    text: comment.text,
                    postedBy: comment.postedBy,
                    user: comment.user
                        ? {
                              _id: comment.user._id,
                              name: comment.user.name,
                              avatar: comment.user.avatar,
                          }
                        : null,
                })),
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                __v: post.__v,
            });
    
            return response.successOK(res, "Post details retrieved successfully", payload);
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
    
 
}

