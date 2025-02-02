
const mongoose = require('mongoose');

// Definir o esquema de feedback
const feedbackSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,  // Torna o campo obrigatório
  },
  mensagem: {
    type: String,
    required: true,  // Torna o campo obrigatório
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Definirá automaticamente a data de criação
  },
});

// Criar o modelo de Feedback com base no esquema e garantir o nome correto da coleção
const Feedback = mongoose.model('Feedback', feedbackSchema, 'feedback'); // 'feedbacks' é o nome da coleção

module.exports = Feedback;

