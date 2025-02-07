const express = require("express");
const router = express.Router();
const Suggestion = require("../models/suggestion");
const mongoose = require("mongoose");

// **Rota GET** - Buscar sugestões e popular com informações do usuário
router.get("/", async (req, res) => {
  try {
    const suggestions = await Suggestion.find(); // Não precisa mais do `populate` já que estamos usando o nome diretamente
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar sugestões: " + error.message });
  }
});

// **Rota POST** - Criar uma nova sugestão
router.post("/", async (req, res) => {
  try {
    let { nome, mensagem } = req.body;

    // Verifica se os campos obrigatórios estão presentes
    if (!nome || !mensagem) {
      return res.status(400).json({ error: "nome e mensagem são obrigatórios." });
    }

    const newSuggestion = new Suggestion({
      nome,  // Agora armazenamos diretamente o nome do usuário
      mensagem,
      createdAt: new Date(),
    });

    const savedSuggestion = await newSuggestion.save();
    res.status(201).json(savedSuggestion);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar sugestão: " + error.message });
  }
});

module.exports = router;
