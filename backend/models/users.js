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
        type:mongoose.Schema.Types.ObjectId,
        ref:'plans',
        default: null
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
    boxes: [{ 
        type: Schema.Types.ObjectId, 
        ref: "boxes" 
    }],
    dataCancelamento: {
        type: Date
    }
})

var Users = mongoose.model('users', usersSchema)
module.exports = Users;