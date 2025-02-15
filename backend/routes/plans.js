var express = require('express');
var router = express.Router();
const Plans = require('../models/plans');
const Users = require('../models/users'); // Certifique-se de importar o modelo correto

// Rota para obter todos os planos
router.get('/', async (req, res) => {
  try {
    const plans = await Plans.find({});
    res.status(200).json(plans);
    console.log('GET: Obtendo todos os planos');
  } catch (err) {
    console.error('Erro ao buscar planos:', err);
    res.status(500).json({ message: 'Erro ao buscar planos.' });
  }
});

// Criar um novo plano
router.post('/', async (req, res) => {
  try {
    const { name, itens, price } = req.body;
    const plan = await Plans.create({ name, itens, price });
    res.status(201).json(plan);
    console.log('POST: Plano criado');
  } catch (err) {
    console.error('Erro ao criar plano:', err);
    res.status(500).json({ message: 'Erro ao criar plano.' });
  }
});

// 🚀 **Nova rota para assinar um plano**
router.post('/subscribe', async (req, res) => {
  try {
    const { userId, planoId } = req.body;

    const plano = await Plans.findById(planoId);
    if (!plano) return res.status(404).json({ message: 'Plano não encontrado.' });

    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    user.assinatura = planoId;
    await user.save();

    res.status(200).json({ message: 'Plano assinado com sucesso!', user });
  } catch (error) {
    console.error('Erro ao assinar plano:', error);
    res.status(500).json({ message: 'Erro ao assinar plano.' });
  }
});

// Editar um plano existente (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, itens, price } = req.body;
    const updatedPlan = await Plans.findByIdAndUpdate(id, { name, itens, price }, { new: true });

    if (!updatedPlan) return res.status(404).json({ message: 'Plano não encontrado.' });

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ message: 'Erro ao atualizar plano.' });
  }
});

// Deletar um plano (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await Plans.findByIdAndDelete(id);

    if (!deletedPlan) return res.status(404).json({ message: 'Plano não encontrado.' });

    res.status(200).json({ message: 'Plano deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar plano:', error);
    res.status(500).json({ message: 'Erro ao deletar plano.' });
  }
});

module.exports = router;
