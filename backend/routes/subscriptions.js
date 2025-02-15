var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Users = require('../models/users');
const Plans = require('../models/plans');

// routes/users.js
router.put("/:userId/subscribe", async (req, res) => {
  console.log("Entrei aqui");
  console.log("Corpo da requisição:", req.body);

  try {
    const { userId } = req.params;
    const { planId } = req.body;

    console.log("ID do plano recebido:", planId);
    
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: "ID do plano inválido." });
    }

    const plano = await Plans.findById(planId);
    if (!plano) {
      return res.status(404).json({ message: "Plano não encontrado." });
    }

    const user = await Users.findByIdAndUpdate(
      userId,
      { assinatura: planId, isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json({ message: "Plano assinado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao assinar plano:", error);
    res.status(500).json({ message: "Erro interno ao assinar plano." });
  }
});


// Rota para cancelar a assinatura de um usuário
router.post('/cancelar/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Encontra o usuário e marca a assinatura como inativa
    const user = await Users.findByIdAndUpdate(userId, { isActive: false }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Assinatura cancelada com sucesso', user });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ message: 'Erro interno ao cancelar assinatura' });
  }
});

module.exports = router;
