var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Users = require('../models/users')

/* GET users listing. */
router.route('/')
.get((req, res, next) =>{
  Users.find({}).populate('assinatura').then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
    console.log('get users infos')
    console.log(user)
  }, (err) => {console.log( 'error:'+ err)})
  .catch((err) => {console.log('error outside'+err)})

})
.post((req,res,next) => {
  Users.create(req.body)
  .then((user) =>{
    console.log("usuario criado", user)
    res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  },(err) => {console.log( 'error:'+ err)})
  .catch((err) => {console.log('error outside'+err)})
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL
    console.log(id)
    const updatedUser = await Users.findByIdAndUpdate(id, req.body, { new: true }).populate('assinatura');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }
    res.status(200).json(updatedUser);
    console.log('PUT - Plano atualizado:', updatedUser);
  } catch (err) {
    console.error('Erro ao atualizar plano:', err);
    res.status(500).json({ error: 'Erro ao atualizar plano' });
  }
});

module.exports = router;
