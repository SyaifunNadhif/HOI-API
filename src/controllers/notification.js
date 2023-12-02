// controllers/notification.js
const Notification = require('../models/notification');
const response = require('../utils/response');

module.exports = {
    getNotifications: async (req, res, next) => {
        try {
            const userId = req.user.id;

            // Ambil semua notifikasi untuk pengguna tertentu
            const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

            return response.successOK(res, 'Notifications retrieved successfully', notifications);
        } catch (error) {
            next(error);
        }
    },

    markAsRead: async (req, res, next) => {
        try {
            const notificationId = req.params.notificationId;

            // Temukan notifikasi berdasarkan ID
            const notification = await Notification.findById(notificationId);

            if (!notification) {
                return response.errorNotFound(res, 'Notification not found');
            }

            // Tandai notifikasi sebagai sudah dibaca
            notification.isRead = true;
            await notification.save();

            return response.successOK(res, 'Notification marked as read successfully');
        } catch (error) {
            next(error);
        }
    },

    markAllAsRead: async (req, res, next) => {
        try {
            const userId = req.user.id;

            // Tandai semua notifikasi pengguna sebagai sudah dibaca
            await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

            return response.successOK(res, 'All notifications marked as read successfully');
        } catch (error) {
            next(error);
        }
    },
};