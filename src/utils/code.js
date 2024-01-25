const {User} = require('../db/models/');

module.exports = {
    // generateCode: async (req, res, next) => {
    //     try {
    //         const currentYear = new Date().getFullYear() % 100;

    //         // Replace 'User' with your actual model
    //         const count = await User.countDocuments();

    //         const code = `PGU-${currentYear}${(count + 1).toString().padStart(2, '0')}`;
    //         console.log(code);
    //         return code;
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    generateCode: async () => {
        const currentYear = new Date().getFullYear() % 100;

            // Replace 'User' with your actual model
        const count = await User.countDocuments();

        const code = `PGU-${currentYear}${(count + 1).toString().padStart(2, '0')}`;
        console.log(code);
        return code;
    },
    // generateOTP: () => {
    //      return Math.floor(100000 + Math.random() * 900000);
    // }
    
};

    