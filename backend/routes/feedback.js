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

module.exports = router;


