const response = require("../utils/response");
const {User} = require('../db/models/'); 
const bcrypt = require('bcryptjs');

module.exports = {
    getHello: async (req, res, next) => {
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

    register: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
    
            if (!name || !email || !password) {
                return response.errorEntity(res, "Invalid credentials!", "Please add all the fields");
            }
    
            const exist = await User.findOne({ email: email });
            if (exist) {
                return response.errorBadRequest(res, "Invalid credentials!", "User already exists with that email");
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashPassword,
            });
    
            const savedUser = await user.save();
            const data = {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
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
            
            const data = {
                id: user._id,
                name: user.name,
                email: user.email
            };
    
            return response.successOK(res, 'Login successful', data);
        } catch (e) {
            next(e);
        }
    }
    
};
