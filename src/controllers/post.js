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

    allPost: async (req, res, next) => {
        try{
            const posts = await Post.find().populate("postedBy", "_id name email");

            return response.successOK(res, "All posts retrieved successfully", posts);
        }catch (e){
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
      
}