const response = require('../utils/response');
const {User, Post} = require('../db/models/');


module.exports = {
    user: async (req, res, next) => {
      try {
          const data = {
            "nama": "nadhif",
            "alamat": "demak"
          };
          return response.successOK(res, "success", data);
      } catch (e) {
          next(e);
      }
      },

    follow: async (req, res, next) => {
      try {
          const { userIdToFollow } = req.params;
          const { user } = req;

          console.log("id user :", user.id);
          console.log("userIdToFollow: ",userIdToFollow);

          if (userIdToFollow === user.id) {
            return response.errorBadRequest(res, "You cannot follow yourself");
          }

          // Check if the user is already following the target user
          if (user.following.includes(userIdToFollow)) {
            return response.errorBadRequest(res, "You are already following this user");
          }
    
          const updatedUser = await User.findByIdAndUpdate(
            user.id,
              { $addToSet: { following: userIdToFollow } },
              { new: true }
          );

          if (!updatedUser) {
            return response.errorNotFound(res, "User not found");
          }
    
          await User.findByIdAndUpdate(
            userIdToFollow,
              { $addToSet: { followers: user.id } },
              { new: true }
          );
          

          return response.successOK(res, "You are now following the user");
      } catch (e) {
          next(e);
      }
    },

    unfollow: async (req, res, next) => {
        try {
            const { userIdToUnfollow } = req.params;
            const { user } = req;

            console.log("id user :", user.id);
            console.log("userIdToUnfollow: ", userIdToUnfollow);

            if (userIdToUnfollow === user.id) {
                return response.errorBadRequest(res, "You cannot unfollow yourself");
            }

            // Check if the user is not following the target user
            if (!user.following.includes(userIdToUnfollow)) {
                return response.errorBadRequest(res, "You are not following this user");
            }

            const updatedUser = await User.findByIdAndUpdate(
                user.id,
                { $pull: { following: userIdToUnfollow } },
                { new: true }
            );

            if (!updatedUser) {
                return response.errorNotFound(res, "User not found");
            }

            await User.findByIdAndUpdate(
                userIdToUnfollow,
                { $pull: { followers: user.id } },
                { new: true }
            );

            return response.successOK(res, "You have unfollowed the user");
        }catch (e) {
          next(e);
        }
    },

    searchUser: async (req, res, next) => {
      try {
        const { keyword } = req.query;
  
        if (!keyword) {
          return response.errorBadRequest(res, 'Keyword is required');
        }
  
        // Cari pengguna berdasarkan nama yang cocok dengan kata kunci
        const users = await User.find({
          name: { $regex: new RegExp(keyword, 'i') }, // 'i' untuk pencarian yang tidak bersifat case-sensitive
        });
  
        if (users.length === 0) {
          return response.errorNotFound(res, 'No users found');
        }
  
        // Format respons dengan daftar pengguna yang sesuai
        const formattedUsers = users.map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }));
  
        return response.successOK(res, 'Users found successfully', formattedUsers);
      } catch (error) {
        next(error);
      }
    },

    getUserProfile: async (req, res, next) => {
      try {
          const { userId } = req.params;
  
          // Cari pengguna berdasarkan ID
          const user = await User.findById(userId).select('-password');
  
          if (!user) {
              return response.errorNotFound(res, "User not found", null);
          }
  
          // Hitung jumlah pengikut dan yang diikuti
          const followersCount = user.followers.length;
          const followingCount = user.following.length;
  
          // Mendapatkan postingan pengguna
          const userPosts = await Post.find({ postedBy: userId }).sort({ createdAt: -1 });
  
          // Hitung total postingan
          const postsCount = userPosts.length;
          console.log(postsCount);
  
          // Objek respons yang mencakup informasi yang ingin ditampilkan
          const userProfile = {
              _id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              followersCount,
              followingCount,
              postsCount,  // Tambahkan jumlah total postingan ke objek respons
              posts: userPosts,
          };
  
          return response.successOK(res, 'User profile retrieved successfully', userProfile);
      } catch (error) {
          next(error);
      }
    },

    updateAvatar: async (req, res, next) => {
      try {
          const { user } = req;
          const { imageUrl } = req.uploadFile;

          // Update avatar pengguna dalam database
          const updatedUser = await User.findByIdAndUpdate(
              user.id,
              { avatar: imageUrl },
              { new: true } // Mengembalikan dokumen yang telah diupdate
          );

          if (!updatedUser) {
              return response.errorNotFound(res, 'User not found');
          }

          // Kembalikan respons sukses bersama data pengguna yang telah diupdate
          return response.successOK(res, 'Avatar updated successfully', { avatar: imageUrl });
      } catch (error) {
          next(error);
      }
    },

    myProfile: async (req, res, next) => {
      try {
          const userId = req.user.id; // Menggunakan id pengguna dari token JWT
  
          // Cari pengguna berdasarkan ID
          const user = await User.findById(userId).select('-password');
  
          if (!user) {
              return response.errorNotFound(res, "User not found", null);
          }
  
          // Hitung jumlah pengikut dan yang diikuti
          const followersCount = user.followers.length;
          const followingCount = user.following.length;
  
          // Mendapatkan postingan pengguna, diurutkan berdasarkan createdAt secara menurun
          const userPosts = await Post.find({ postedBy: userId }).sort({ createdAt: -1 });
  
          // Hitung total postingan
          const postsCount = userPosts.length;
  
          // Objek respons yang mencakup informasi yang ingin ditampilkan
          const userProfile = {
              _id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              followersCount,
              followingCount,
              postsCount,
              posts: userPosts,
          };
  
          return response.successOK(res, 'User profile retrieved successfully', userProfile);
      } catch (error) {
          next(error);
      }
    },

    getMyProfile: async (req, res, next) => {
      try {
        const userId = req.user.id; // Menggunakan id pengguna dari token JWT

        // Cari pengguna berdasarkan ID
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return response.errorNotFound(res, "User not found", null);
        }

        // Hitung jumlah pengikut dan yang diikuti
        const followersCount = user.followers.length;
        const followingCount = user.following.length;

        // Mendapatkan postingan pengguna, diurutkan berdasarkan createdAt secara menurun
        const userPosts = await Post.find({ postedBy: userId }).sort({ createdAt: -1 });

        // Hitung total postingan
        const postsCount = userPosts.length;

        // Objek respons yang mencakup informasi yang ingin ditampilkan
        const userProfile = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            code: user.code,
            address: user.address,
            phone: user.phone,
            parent_number: user.parent_number 
        };

        return response.successOK(res, 'User profile retrieved successfully', userProfile);
      } catch (error) {
            next(error);
      }
    },
  
}