const { Notif } = require('../db/models/');

module.exports = {
  sendNotif: async (notifs, next) => {
    try {
      const savedNotifs = [];

      // Iterasi setiap notifikasi dalam array
      for (const notifData of notifs) {
        // Membuat notifikasi baru menggunakan model Notif
        const newNotif = new Notif({
          user_id: notifData.user_id,
          title: notifData.title,
          description: notifData.description,
        });

        // Menyimpan notifikasi baru ke dalam database
        const savedNotif = await newNotif.save();
        savedNotifs.push(savedNotif);

        // Memberi tahu bahwa notifikasi telah dikirim untuk pengguna tertentu
        console.log(`Notifikasi dikirim untuk pengguna ${notifData.user_id}`);
      }

      return savedNotifs;
    } catch (err) {
      // Menangani kesalahan dengan melemparnya kembali
      next(err);
    }
  },
};
