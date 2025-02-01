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
        type:String
    },
    endereco:{
        type:String
    },
    cpf:{
        type:Number
    },
    numeroCartao:{
        type:Number
    },
    cvv:{
        type:Number
    },
    validadeCartao:{
        type:String
    },
    inicioAssinatura:{
        type:Date,
        default: Date.now
    }

})

var Users = mongoose.model('users', usersSchema)
module.exports = Users;