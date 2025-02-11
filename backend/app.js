const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const router = express.Router();

// Conexão com o MongoDB
const url = 'mongodb://127.0.0.1:27017/thequestion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Conectado corretamente ao servidor');
}, (err) => {
  console.log(err);
});

const app = express();

// Middleware de sessão (coloque depois do cookieParser e antes do CORS)
app.use(cookieParser());
app.use(session({
  secret: 'meuSegredo123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: url, // Reutilizando a URL do MongoDB
    collectionName: 'sessions',
  }),
  cookie: {
    secure: false, // Altere para true se estiver usando HTTPS
    httpOnly: true, // Protege contra ataques XSS
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
  },
}));

// CORS (coloque depois do express-session)
app.use(cors({
  origin: 'http://localhost:3000', // Ajuste para o front-end correto
  credentials: true, // Permite envio de cookies entre front e back
}));


router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ email, senha }); // Simulação da busca no BD
  if (!user) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos' });
  }

  req.session.user = user; // Armazena o usuário na sessão
  res.json({ message: 'Login bem-sucedido', user });
});


router.get('/current-user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  res.json(req.session.user);
});

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


module.exports = router;
module.exports = app;

