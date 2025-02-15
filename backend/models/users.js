const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    tipo:{
        type: String,
        required: true
    },
    assinatura:{
        type: Schema.Types.ObjectId,
        ref:'assinatura'
    },
    isActive: { type: Boolean, default: true }
});

const Users = mongoose.model('users', usersSchema);
module.exports = Users;