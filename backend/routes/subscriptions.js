var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Users = require('../models/users');
const Plans = require('../models/plans');

// Rota para o usuário assinar um plano
router.put("/:userId/subscribe", async (req, res) => {
  console.log("Entrei aqui")
  console.log("Corpo da requisição:", req.body);

  try {
    const { userId } = req.params;
    const planId  = req.body.planId;

    console.log("ID do plano recebido:", planId);
    console.log("Tipo de planId:", typeof planId);

    if (planId.length !== 24) {
      return res.status(400).json({ message: "ID do plano deve ter 24 caracteres." });
    }

    const hexRegex = /^[0-9A-Fa-f]{24}$/;
    if (!hexRegex.test(planId)) {
      return res.status(400).json({ message: "ID do plano inválido. Deve ser uma string hexadecimal de 24 caracteres." });
    }

    const objectIdPlano = new mongoose.Types.ObjectId(planId);
    
    // Verifica se o planId é válido
    if (!mongoose.Types.ObjectId.isValid(objectIdPlano)) {
      return res.status(400).json({ message: "ID do plano inválido." });
    }


    // Verifica se o plano existe
    const plano = await Plans.findById(objectIdPlano);
    if (!plano) {
      return res.status(404).json({ message: "Plano não encontrado." });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Atualiza o plano do usuário
    user.assinatura = objectIdPlano;  // Atualize aqui para usar o ObjectId
    user.isActive = true;

    // Associa as caixas do plano ao usuário
    for (const boxId of plano.boxes) {
      if (!user.boxes.includes(boxId)) {
        user.boxes.push(boxId); // Adiciona as caixas ao usuário
      }
    }

    await user.save();

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
