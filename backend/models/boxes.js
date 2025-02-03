const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoxSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  tema: { type: String, required: true },
  itens: { type: [String], required: true },
  plan: {
    type: Schema.Types.ObjectId, 
    ref: 'plans',
    required: true 
  }
});

module.exports = mongoose.model("Box", BoxSchema);
