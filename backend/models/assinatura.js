const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assinaturaSchema = new Schema({
    endereco: {
        type: String
    },
    cpf: {
        type: Number
    },
    numeroCartao: {
        type: Number
    },
    cvv: {
        type: Number
    },
    validadeCartao: {
        type: String
    },
    dataCancelamento: {
        type: Date
    },
    dataAssinatura: {  // Novo campo adicionado
        type: Date,
        default: Date.now  // Define a data atual como valor padrão
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    plano: {
        type: Schema.Types.ObjectId,  // Referência ao Plano
        ref: 'plans',  // Nome do modelo de plano
        required: true  // Pode ser necessário dependendo da sua lógica
    }
});

const Assinatura = mongoose.model('assinatura', assinaturaSchema);
module.exports = Assinatura;