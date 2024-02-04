const response = require('../utils/response');
const moment = require('moment');

const {Notif} = require('../db/models/');

module.exports = {
    index: async (req, res, next) => {
        try{
            const userId = req.user.id;

            const notifications = await Notif.find({ user_id: userId }).sort({ createdAt: -1 });


            return response.successOK(res, 'All Data Notification by user', notifications);
        }catch(err){
            next(err);
        }
    },

    readNotif: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
    
            // Cari notifikasi berdasarkan id dan user_id
            const notification = await Notif.findOne({ _id: id, user_id: userId });
    
            // Periksa apakah notifikasi ditemukan
            if (!notification) {
                return response.errorNotFound(res, 'Notification not found', null);
            }
    
            // Set isRead menjadi true dan simpan perubahan
            notification.isRead = true;
            await notification.save();
    
            return response.successOK(res, 'Notification marked as read successfully', null);
        } catch (err) {
            next(err);
        }
    },
    

}