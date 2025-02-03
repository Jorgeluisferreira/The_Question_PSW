const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plansSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    itens: {
        type: [String],
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    boxes: [{
        type: Schema.Types.ObjectId, 
        ref: 'boxes',
        default: [] 
    }]
})

var Plans = mongoose.model('plans', plansSchema)
module.exports = Plans;