/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
const expres = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const {
  login, postUser,
} = require('./controllers/users.js');
const auth = require('./middlewares/auth');

const NOT_FOUND = 404;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = expres();

// Парсим все пакеты в джсон рег.боди
app.use(bodyParser.json());

// Вход(авторизация) и регистрация
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?)/),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }).unknown(true),
}), postUser);

// Аутенфикация
app.use(auth);

// Все запросы на /users
app.use('/users', require('./routes/users.js'));
// Все запросы на /cards
app.use('/cards', require('./routes/cards.js'));

// Не существующие запросы
app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Такого адреса не существует' });
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(3000, () => {
  console.log('server started');
});
