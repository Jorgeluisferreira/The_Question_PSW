const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Conexão com o MongoDB
const url = 'mongodb://127.0.0.1:27017/thequestion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Conectado corretamente ao servidor');
}, (err) => {
  console.log(err);
});

const app = express();

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
  },
}));

// Outros middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const indexRouter = require('./routes/index');
const plansRouter = require('./routes/plans');
const usersRouter = require('./routes/users'); // Importa as rotas de usuários
const feedbackRouter = require('./routes/feedback');
const boxesRouter = require('./routes/boxes');
const subscriptionsRouter = require('./routes/subscriptions');
const suggestionRoutes = require('./routes/suggestion');

app.use('/', indexRouter);
app.use('/plans', plansRouter);
app.use('/users', usersRouter); // Usa as rotas de usuários
app.use('/feedback', feedbackRouter);
app.use('/boxes', boxesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/suggestions', suggestionRoutes);

module.exports = app;