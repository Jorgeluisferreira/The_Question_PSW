const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../models/users');
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.route('/')
  .get(async (req, res, next) => {
    try {
      const users = await Users.find({}).populate('assinatura');
      res.status(200).json(users);
      console.log('GET - Informações dos usuários:', users);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  })
  .post(async (req, res, next) => {
    try {
      const { senha, ...rest } = req.body; // Extrai a senha do corpo da requisição

      // Criptografa a senha
      const salt = await bcrypt.genSalt(10); // Gera um salt
      const hashedPassword = await bcrypt.hash(senha, salt); // Criptografa a senha

      // Cria o usuário com a senha criptografada
      const user = await Users.create({ ...rest, senha: hashedPassword });

      res.status(201).json(user);
      console.log('POST - Usuário criado:', user);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  });

// Rota para fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca o usuário pelo email
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Logs para depuração
    console.log('Senha fornecida:', senha);
    console.log('Senha criptografada no banco:', user.senha);

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Se a senha estiver correta, retorna o usuário (ou um token JWT, por exemplo)
    res.status(200).json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Rota para atualizar um usuário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL

    // Verifica se o corpo da requisição contém a senha
    if (req.body.senha) {
      const salt = await bcrypt.genSalt(10);
      req.body.senha = await bcrypt.hash(req.body.senha, salt); // Criptografa a nova senha
    }

    const updatedUser = await Users.findByIdAndUpdate(id, req.body, { new: true }).populate('assinatura');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(updatedUser);
    console.log('PUT - Usuário atualizado:', updatedUser);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

module.exports = router;