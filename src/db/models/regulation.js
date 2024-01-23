const mongoose = require('mongoose');


const RegulationSchema = new mongoose.Schema({
    rule: {
        type: String,
        required: true,
    },
});

const Regulation = mongoose.model('Regulation', RegulationSchema);

module.exports = Regulation;
