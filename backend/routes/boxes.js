const express = require('express');
const router = express.Router();
const Box = require('../models/boxes');
const Plans = require('../models/plans');
const Users = require('../models/plans');

// Buscar todas as caixas
router.get('/', async (req, res) => {
  try {
    const boxes = await Box.find();
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar caixas' });
  }
});

// Criar uma nova caixa
router.post('/', async (req, res) => {
  try {
      const { nome, tema, itens, plan } = req.body;

      // Verifica se o plano existe
      const existingPlan = await Plans.findById(plan);
      if (!existingPlan) {
          return res.status(404).json({ message: 'Plano não encontrado' });
      }

      // Cria a nova caixa
      const newBox = await Box.create({ nome, tema, itens, plan });

      // Atualiza o plano para incluir a nova caixa
      existingPlan.boxes.push(newBox._id);
      await existingPlan.save();

      // Encontra os usuários que ainda têm a assinatura ativa nesse plano
      const activeUsers = await Users.find({ plan: existingPlan._id, isActive: true });

      // Adiciona a nova caixa apenas aos usuários com assinatura ativa
      for (const user of activeUsers) {
          user.boxes.push(newBox._id);
          await user.save();
      }

      res.status(201).json(newBox);
  } catch (error) {
      console.error('Erro ao criar caixa:', error);
      res.status(500).json({ message: 'Erro interno ao criar caixa' });
  }
});


// Deletar uma caixa e remover a referência nos planos e usuários

router.delete('/:id', async (req, res) => {
  try {
    const boxId = req.params.id;

    // Busca a caixa antes de deletar
    const existingBox = await Box.findById(boxId);
    if (!existingBox) {
      return res.status(404).json({ message: 'Caixa não encontrada' });
    }

    // Remove a caixa do plano ao qual estava vinculada
    await Plans.findByIdAndUpdate(existingBox.plan, { $pull: { boxes: boxId } });

    // Remove a caixa de todos os usuários que a possuíam
    await Users.updateMany({}, { $pull: { boxes: boxId } });

    // Deleta a caixa
    await Box.findByIdAndDelete(boxId);

    res.json({ message: 'Caixa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar caixa:', error);
    res.status(500).json({ error: 'Erro ao deletar caixa' });
  }
});


module.exports = router;
