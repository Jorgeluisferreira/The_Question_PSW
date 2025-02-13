const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback'); // Importe corretamente o modelo de feedback

// Defina as rotas para feedback aqui
router.route('/')
  .get((req, res, next) => {
    Feedback.find({}).then((feedbacks) => {
      res.status(200).json(feedbacks);
    }).catch((err) => {
      res.status(500).send('Erro ao buscar feedbacks');
    });
  })
  .post((req, res) => {
    const { nome, mensagem } = req.body;
    const newFeedback = new Feedback({
      nome,
      mensagem,
      createdAt: new Date(),
    });

    newFeedback.save()
      .then((feedback) => {
        res.status(201).json(feedback);
      })
      .catch((err) => {
        res.status(500).send('Erro ao salvar feedback');
      });
  });

    // Editar feedback
    router.route('/:id')
    .put((req, res) => {
      const { id } = req.params;
      const { mensagem } = req.body;
  
      Feedback.findByIdAndUpdate(id, { mensagem }, { new: true })
        .then((feedback) => {
          if (!feedback) {
            return res.status(404).json({ error: 'Feedback não encontrado' });
          }
          res.status(200).json(feedback);
        })
        .catch((err) => {
          res.status(500).json({ error: 'Erro ao atualizar feedback' });
        });
    })
    .delete((req, res) => {
      const { id } = req.params;
  
      Feedback.findByIdAndDelete(id)
        .then((feedback) => {
          if (!feedback) {
            return res.status(404).json({ error: 'Feedback não encontrado' });
          }
          res.status(200).json({ message: 'Feedback deletado com sucesso' });
        })
        .catch((err) => {
          res.status(500).json({ error: 'Erro ao excluir feedback' });
        });
    });
  

module.exports = router;


