var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var plansRouter = require('./routes/plans');
var usersRouter = require('./routes/users');
var feedbackRouter = require('./routes/feedback');
var boxesRouter = require('./routes/boxes');
var subscriptionsRouter = require('./routes/subscriptions');
const suggestionRoutes = require('./routes/suggestion');


const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/thequestion'
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("connected correctly to server")
}, (err) =>{console.log(err)});


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/plans', plansRouter);
app.use('/users', usersRouter);
app.use('/feedback', feedbackRouter);
app.use('/boxes', boxesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/suggestions', suggestionRoutes);

module.exports = app;
