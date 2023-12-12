const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const {User} = require('../db/models/'); 

module.exports = {
    protected: async (req, res, next) => {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                return res.status(401).json({
                    status: false,
                    message: 'you\'re not authorized!',
                    data: null
                });
            }

            const data = await jwt.verify(authorization, JWT_SECRET_KEY);
            
            // Ambil data pengguna dari database
            // const user = await User.findById(data.id).select('-password').lean(false);

          

            const user = await User.findById(data.id).select('-password');
            const userInstance = new User(user); // Membuat instance model User

            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid user!',
                    data: null
                });
            }
            
            req.user = {
                id: userInstance.id,
                name: userInstance.name,
                email: userInstance.email,
                avatar: userInstance.avatar,
                user_type: userInstance.user_type,
                followers: userInstance.followers,
                following: userInstance.following,
            };

            // // Cek apakah pengguna adalah admin
            // if (req.user.userType !== 'admin') {
            //     return res.status(403).json({
            //         status: false,
            //         message: 'You do not have permission to access this resource!',
            //         data: null
            //     });
            // }

            next();
        } catch (err) {
            next(err);
        }
    }
};

