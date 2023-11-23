const response = require('../utils/response');
const {User, Post} = require('../db/models/'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../config/key');

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

    
}