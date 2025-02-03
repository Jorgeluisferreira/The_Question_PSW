var express = require('express');
var router = express.Router();
const Plans = require('../models/plans')

/* GET users listing. */
router.route('/')
.get((req, res, next) =>{
  Plans.find({}).then((plans) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(plans);
    console.log('get plans infos')
  }, (err) => {console.log( 'error:'+ err)})
  .catch((err) => {console.log('error outside'+err)})

})
.post((req,res,next) => {
  
  const { name, itens, price } = req.body;

    Plans.create({
      name,
      itens,
      price
  })
    .then((plan) => {
      console.log("Plano criado", plan);
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.json(plan);
    }, (err) => {console.log( 'error:'+ err)})
    .catch((err) => {console.log('error outside'+err)})
})
// Função de assinatura do plano
.post((req, res, next) => {
  const { userId, planoId } = req.body; // Espera-se que o corpo tenha o `userId` e `planoId`

  // Encontrar o plano
  Plans.findById(planoId)
    .then((plan) => {
      if (!plan) {
        return res.status(404).json({ message: "Plano não encontrado." });
      }

      // Encontrar o usuário
      User.findById(userId)
        .then((user) => {
          if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
          }

          // Atualizar a assinatura do usuário
          user.assinatura = planoId;  // O plano assinado
          
          // Associa as caixas do plano ao usuário
          user.boxes = [...user.boxes, ...plan.boxes]; // Associa as caixas ao usuário

          // Salva o usuário atualizado
          user.save()
            .then((updatedUser) => {
              res.status(200).json({ message: "Plano assinado com sucesso!", user: updatedUser });
            })
            .catch((err) => {
              console.error("Erro ao salvar o usuário:", err);
              res.status(500).json({ message: "Erro ao assinar o plano." });
            });
        })
        .catch((err) => {
          console.error("Erro ao encontrar o usuário:", err);
          res.status(500).json({ message: "Erro ao encontrar o usuário." });
        });
    })
    .catch((err) => {
      console.error("Erro ao encontrar o plano:", err);
      res.status(500).json({ message: "Erro ao encontrar o plano." });
    });
});

module.exports = router;
