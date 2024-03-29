const response = require('../utils/response');
const code = require('../utils/code');
const {User} = require('../db/models/'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    getHello: (req, res, next) => {
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
    
    register : async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
    
            if (!name || !email || !password) {
                return response.errorEntity(res, 'Invalid credentials!', 'Please add all the fields');
            }
            const exist = await User.findOne({ email: email });
            if (exist) {
                return response.errorBadRequest(res, 'Invalid credentials!', 'User already exists with that email');
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const codePendaki = await code.generateCode();
            const user = new User({
                name,
                email,
                password: hashPassword,
                code: codePendaki
            });
            const savedUser = await user.save();
            const data = {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                code: savedUser.code
            };
            return response.successOK(res, 'Successfully registered', data);
        } catch (e) {
            next(e);
        }
    },
    
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
    
            if (!email || !password) {
                return response.errorEntity(res, "Invalid credentials!", "Please add all the fields");
            }
    
            const user = await User.findOne({ email: email });
    
            if (!user) {
                return response.errorBadRequest(res, "Invalid credentials!", "Invalid Email or Password");
            }
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
    
            if (!isPasswordValid) {
                return response.errorBadRequest(res, "Invalid credentials!", "Invalid Email or Password");
            }
            
            const payload = {
                id: user._id,
                name: user.name,
                email: user.email
            };



            const token = await jwt.sign(payload, JWT_SECRET_KEY);
    
            return res.status(200).json({
                status: true,
                message: 'login success!',
                data: {
                    token: token
                }
            });
        } catch (e) {
            next(e);
        }
    },

    whoami: async (req, res, next) => {
        try {
            return res.status(200).json({
                status: true,
                message: 'fetch user success!',
                data: req.user
            });
        } catch (e) {
            next(e);
        }
    },
    
};
