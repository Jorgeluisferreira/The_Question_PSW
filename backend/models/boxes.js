const mongoose = require("mongoose");

const BoxSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  tema: { type: String, required: true },
  itens: { type: [String], required: true },
});

module.exports = mongoose.model("Box", BoxSchema);
