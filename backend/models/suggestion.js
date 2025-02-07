const mongoose = require("mongoose");

// Definir o esquema da sugestão
const suggestionSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  mensagem: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Criar o modelo de Suggestion garantindo o nome correto da coleção
const Suggestion = mongoose.model("Suggestion", suggestionSchema, "suggestions");

module.exports = Suggestion;



