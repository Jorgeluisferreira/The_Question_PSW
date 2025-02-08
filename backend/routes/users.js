var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Users = require('../models/users')
const bcrypt = require('bcryptjs');
const router = express.Router();

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


router.post('/register', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;  // Recebe as informações do usuário do corpo da requisição

  try {
      // Verifica se o usuário já existe
      const userExists = await Users.findOne({ email });

      if (userExists) {
          return res.status(400).send('Email já está em uso!');
      }

      // Criptografa a senha antes de salvar no banco de dados
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Cria um novo usuário no banco de dados
      const newUser = new Users({
          nome,
          email,
          senha: hashedPassword,
          tipo,  // Exemplo: 'admin' ou 'usuário comum'
          isActive: true  // Usuário ativo por padrão
      });

      // Salva o novo usuário no banco de dados
      await newUser.save();

      res.status(201).send('Usuário registrado com sucesso!');
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao registrar usuário!');
  }
});



module.exports = router;
