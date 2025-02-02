const express = require('express');
const router = express.Router();
const Box = require('../models/boxes');

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
    const box = new Box(req.body);
    await box.save();
    res.status(201).json(box);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar caixa' });
  }
});

// Atualizar uma caixa
router.put('/:id', async (req, res) => {
  try {
    const updatedBox = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBox);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar caixa' });
  }
});

// Deletar uma caixa
router.delete('/:id', async (req, res) => {
  try {
    await Box.findByIdAndDelete(req.params.id);
    res.json({ message: 'Caixa deletada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar caixa' });
  }
});

module.exports = router;

module.exports = router;
