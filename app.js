/* eslint-disable no-console */
/* TODO: Благодарю за топовые коменты - Хотел уточнить почему не убираю populate -
 меня предыдущий ревьюер попросил оставить его при выводе всех карточек - 2-ой вызов убрал
 (вдруг дальше в работе пригодится - если нет уберу!) */

const expres = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const {
  login, postUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/not-found');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = expres();

// Парсим все пакеты в джсон рег.боди
app.use(bodyParser.json());

// Вход(авторизация) и регистрация
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?)/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), postUser);

// Аутенфикация
app.use(auth);

// Все запросы на /users
app.use('/users', require('./routes/users'));
// Все запросы на /cards
app.use('/cards', require('./routes/cards'));

// Не существующие запросы
app.use('/', (req, res, next) => {
  const error = new NotFound('Такого адреса не существует');
  next(error);
});

// Обработчик ошибок Joi
app.use(errors());

// Централизованный обработчик
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(3000, () => {
  console.log('server started');
});
