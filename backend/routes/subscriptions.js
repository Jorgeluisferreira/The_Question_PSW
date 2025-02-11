const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscritpion'); // Modelo de Assinatura
const User = require('../models/users'); // Modelo de Usuário
const Plans = require('../models/plans'); // Modelo de Planos

// Listar todas as assinaturas
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({}).populate('userId').populate('planId');
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error('Erro ao buscar assinaturas:', err);
    res.status(500).json({ message: 'Erro ao buscar assinaturas.' });
  }
});

// Criar uma nova assinatura
router.post('/', async (req, res) => {
  try {
    const { userId, planId } = req.body;

    // Verifica se o usuário e o plano existem
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const plan = await Plans.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plano não encontrado.' });

    // Criar a assinatura no banco de dados
    const newSubscription = await Subscription.create({
      userId,
      planId,
      createdAt: new Date()
    });

    // Atualiza o usuário com a assinatura ativa
    user.assinatura = newSubscription._id;
    await user.save();

    res.status(201).json({ message: 'Assinatura criada com sucesso!', subscription: newSubscription });
  } catch (err) {
    console.error('Erro ao criar assinatura:', err);
    res.status(500).json({ message: 'Erro ao criar assinatura.' });
  }
});

// Atualizar uma assinatura
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { planId } = req.body;

    const subscription = await Subscription.findByIdAndUpdate(id, { planId }, { new: true });

    if (!subscription) {
      return res.status(404).json({ message: 'Assinatura não encontrada.' });
    }

    res.status(200).json({ message: 'Assinatura atualizada com sucesso!', subscription });
  } catch (err) {
    console.error('Erro ao atualizar assinatura:', err);
    res.status(500).json({ message: 'Erro ao atualizar assinatura.' });
  }
});

// Deletar uma assinatura
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Assinatura não encontrada.' });
    }

    res.status(200).json({ message: 'Assinatura deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar assinatura:', err);
    res.status(500).json({ message: 'Erro ao deletar assinatura.' });
  }
});

module.exports = router;
