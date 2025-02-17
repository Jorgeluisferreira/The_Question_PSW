const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users');
const Assinatura = require('../models/assinatura');

const router = express.Router();

/* GET todas as assinaturas */
router.get('/assinatura', async (req, res) => {
  try {
    const assinaturas = await Assinatura.find({});
    res.status(200).json(assinaturas);
    console.log('GET - Assinaturas encontradas:', assinaturas);
  } catch (err) {
    console.error('Erro ao buscar assinaturas:', err);
    res.status(500).json({ error: 'Erro ao buscar assinaturas' });
  }
});

/* GET todos os usuários */
router.get('/', async (req, res) => {
  try {
    const users = await Users.find({}).populate('assinatura');
    res.status(200).json(users);
    console.log('GET - Usuários encontrados:', users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

/* Criar um novo usuário */
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    // Verifica se o usuário já existe
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email já está em uso!' });
    }

    // Cria o usuário
    const newUser = new Users({
      nome,
      email,
      senha, // Senha salva diretamente (sem criptografia)
      tipo,
      isActive: true,
    });

    await newUser.save();

    res.status(201).json(newUser);
    console.log('POST - Usuário criado:', newUser);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

/* Atualizar um usuário */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, tipo, endereco, cpf, numeroCartao, cvv, validadeCartao } = req.body;
    console.log('Dados recebidos para atualizar usuário:', req.body);

    // Atualiza o usuário
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { nome, email, tipo},
      { new: true }
    ).populate('assinatura');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    let assinatura;
    if (updatedUser.assinatura) {
      // Atualiza a assinatura existente
      assinatura = await Assinatura.findByIdAndUpdate(
        updatedUser.assinatura._id,
        { endereco, cpf, numeroCartao, cvv, validadeCartao },
        { new: true }
      );
    } else {
      // Cria uma nova assinatura
      assinatura = new Assinatura({
        user: new mongoose.Types.ObjectId(id),
        plano: new mongoose.Types.ObjectId(id),
        endereco,
        cpf,
        numeroCartao,
        cvv,
        validadeCartao,
      });
      await assinatura.save();

      // Atualiza o usuário com a nova assinatura
      updatedUser.assinatura = assinatura;
      await updatedUser.save();
    }

    res.status(200).json(updatedUser);
    console.log('PUT - Usuário atualizado:', updatedUser);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

/* Registrar um novo usuário */
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo, endereco, cpf, numeroCartao, cvv, validadeCartao } = req.body;

    // Verifica se o usuário já existe
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email já está em uso!' });
    }

    // Cria o usuário
    const newUser = new Users({
      nome,
      email,
      senha, // Senha salva diretamente (sem criptografia)
      tipo,
      isActive: true,
    });

    await newUser.save();

    // Cria a assinatura
    const novaAssinatura = new Assinatura({
      endereco,
      cpf,
      numeroCartao,
      cvv,
      validadeCartao,
      dataCancelamento: null,
      user: newUser._id,
    });

    await novaAssinatura.save();

    // Associa a assinatura ao usuário
    newUser.assinatura = novaAssinatura._id;
    await newUser.save();

    res.status(201).json(newUser);
    console.log('POST /register - Usuário registrado:', newUser);
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

module.exports = router;