const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const { User } = require('../db/models');

module.exports = {
    protected: async (req, res, next) => {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                return res.status(401).json({
                    status: false,
                    message: 'You\'re not authorized!',
                    data: null
                });
            }

            const data = await jwt.verify(authorization, JWT_SECRET_KEY);

            const user = await User.findById(data.id).select('-password');
            const userInstance = new User(user);

            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid user!',
                    data: null
                });
            }

            // Menambahkan pengecekan user_type untuk akses 'basic' atau 'admin'
            if (userInstance.user_type !== 'basic' && userInstance.user_type !== 'admin') {
                return res.status(403).json({
                    status: false,
                    message: 'You don\'t have permission to access this resource!',
                    data: null
                });
            }

            req.user = {
                id: userInstance.id,
                name: userInstance.name,
                email: userInstance.email,
                avatar: userInstance.avatar,
                user_type: userInstance.user_type,
            };

            next();
        } catch (err) {
            next(err);
        }
    }
};
