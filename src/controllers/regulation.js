const {Regulation} = require('../db/models');
const response = require('../utils/response');

module.exports = {
    getAll: async (req, res, next) => {
        try {
          const regulations = await Regulation.find();
      
          // Mengubah format data untuk hanya mencakup id dan rule
          const simplifiedRegulations = regulations.map(regulation => ({
            id: regulation._id,
            rule: regulation.rule,
            // Tambahkan properti lain yang ingin Anda sertakan jika ada
          }));
      
          return response.successOK(res, 'All regulations retrieved successfully', simplifiedRegulations);
        } catch (error) {
          next(error);
        }
      },
      

    createData: async (req, res, next) => {
        try{
            const { rule } = req.body;
            if (req.user.user_type !== 'admin') {
                return response.errorPermission(res, 'You do not have permission to access this resource!', 'you not admin');
            }
    
            const addRegulation = new Regulation({
                rule
              });

             await addRegulation.save();
        
             return response.successCreated(res, 'Regulation added successfully', addRegulation);
        }catch(e){
            next(e);
        }
    },

    deleteData: async (req, res, next) => {
        try {
          const { id } = req.params;
      
          // Verifikasi izin admin
          if (req.user.user_type !== 'admin') {
            return response.errorPermission(res, 'You do not have permission to delete this resource!', 'Not authorized');
          }
      
          // Temukan regulasi berdasarkan ID dan hapus
          const deletedRegulation = await Regulation.findByIdAndDelete(id);
      
          if (!deletedRegulation) {
            return response.errorNotFound(res, 'Regulation not found', 'Regulation not found with the provided ID');
          }
      
          return response.successOK(res, 'Regulation deleted successfully');
        } catch (error) {
          next(error);
        }
      },

      updateData: async (req, res, next) => {
        try {
          const { id } = req.params;
          const { rule } = req.body;
      
          // Verifikasi izin admin
          if (req.user.user_type !== 'admin') {
            return response.errorPermission(res, 'You do not have permission to update this resource!', 'Not authorized');
          }
      
          // Temukan regulasi berdasarkan ID dan perbarui
          const updatedRegulation = await Regulation.findByIdAndUpdate(
            id,
            { rule },
            { new: true, runValidators: true }
          );
      
          if (!updatedRegulation) {
            return response.errorNotFound(res, 'Regulation not found', 'Regulation not found with the provided ID');
          }
      
          return response.successOK(res, 'Regulation updated successfully', updatedRegulation);
        } catch (error) {
          next(error);
        }
      },
      


      
    
    
};