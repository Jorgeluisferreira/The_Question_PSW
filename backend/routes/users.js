const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Users = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Adicione esta linha para usar JWT

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

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o usuário existe
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera um token JWT
    const token = jwt.sign({ id: user._id }, 'seuSegredoAqui', { expiresIn: '1h' });

    // Retorna o token e algumas informações do usuário (opcional)
    res.status(200).json({ token, user: { id: user._id, nome: user.nome, email: user.email } });
    console.log('POST - Login realizado com sucesso:', user.email);
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

module.exports = router;