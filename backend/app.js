var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');
const Users = require('./models/users'); // Certifique-se de importar o modelo Users
const session = require('express-session');
const MongoStore = require('connect-mongo');
const usersRouter = require('./routes/users');

// Conexão com o MongoDB
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/thequestion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Conectado corretamente ao servidor");
}, (err) => {
    console.log(err);
});

var app = express();

// Configuração do middleware de sessão
app.use(session({
    secret: 'meuSegredo123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/thequestion',
        collectionName: 'sessions',
    }),
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24, 
    }
}));

// Outros middlewares
app.use(logger('dev'));
app.use(express.json()); // Middleware para analisar o corpo da requisição como JSON
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rota de login - utilizando o banco de dados e criptografia de senha
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;  // Recebe o email e a senha do corpo da requisição

    try {
        // Encontre o usuário no banco de dados pelo email
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(401).send('Usuário não encontrado!');
        }

        // Compare a senha fornecida com a senha armazenada no banco de dados
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(401).send('Senha inválida!');
        }

        // Se a senha for válida, armazene o usuário na sessão
        req.session.user = { 
            id: user._id, 
            nome: user.nome, 
            email: user.email,
            tipo: user.tipo,
            isActive: user.isActive 
        };

        res.send('Usuário logado com sucesso!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor!');
    }
});

// Resto das rotas...
var indexRouter = require('./routes/index');
var plansRouter = require('./routes/plans');
var feedbackRouter = require('./routes/feedback');
var boxesRouter = require('./routes/boxes');
var subscriptionsRouter = require('./routes/subscriptions');
const suggestionRoutes = require('./routes/suggestion');

// Definindo as outras rotas
app.use('/', indexRouter);
app.use('/plans', plansRouter);
app.use('/users', usersRouter);
app.use('/feedback', feedbackRouter);
app.use('/boxes', boxesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/suggestions', suggestionRoutes);

app.use(express.json());
app.use('/users', usersRouter); 


module.exports = app;
