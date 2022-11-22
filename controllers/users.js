/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user.js');

const GOOD_REQUEST = 200;
const INCORRECT_DATA = 400;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;
const UNAUTHORIZED = 401;
const CONFLICT = 409;

// Возвращаем всех пользователей
module.exports.getUsers = (req, res, next) => {
  UserSchema.find({})
    .then((data) => {
      const users = [];
      data.forEach((item) => {
        const {
          email, name, about, avatar,
        } = item;
        users.push({
          email, name, about, avatar,
        });
      });
      res.status(GOOD_REQUEST).send({
        users,
      });
    })
    .catch((err) => {
      const error = new Error('Ошибка на сервере');
      error.statusCode = SERVER_ERROR;
      next(error);
    });
};

// Возвращаем пользователя
module.exports.getUserMe = (req, res, next) => {
  UserSchema.findById(req.user._id)
    .then((data) => {
      if (data === null) {
        const err = new Error('errorId');
        err.name = 'ResourceNotFound';
        throw err;
      } else {
        const {
          email, name, about, avatar,
        } = data;
        res.status(GOOD_REQUEST).send({
          email, name, about, avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Передан некоректный _id.' });
      } else if (err.name === 'ResourceNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
        next(error);
      }
    });
};

// Возвращаем пользователя по ид
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  UserSchema.findById(userId)
    .then((data) => {
      if (data === null) {
        const err = new Error('errorId');
        err.name = 'ResourceNotFound';
        throw err;
      } else {
        const {
          email, name, about, avatar,
        } = data;
        res.status(GOOD_REQUEST).send({
          email, name, about, avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Передан некоректный _id.' });
      } else if (err.name === 'ResourceNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
        next(error);
      }
    });
};

// Создаем пользователя - регистрация
module.exports.postUser = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    res.status(INCORRECT_DATA).send({ message: 'Передан некорректный email при создании пользователя.' });
  } else if (req.body.password.length < 8) {
    const error = new Error('Переданы некорректные данные при создании пользователя.');
    error.statusCode = INCORRECT_DATA;
    next(error);
  } else {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => UserSchema.create({
        avatar: req.body.avatar,
        about: req.body.about,
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
        .then((data) => {
          const {
            email, name, about, avatar,
          } = data;
          res.status(GOOD_REQUEST).send({
            email, name, about, avatar,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new Error('Переданы некорректные данные при создании пользователя.');
            error.statusCode = INCORRECT_DATA;
            next(error);
          } if (err.code === 11000) {
            const error = new Error('Такой email уже зарегестрирован.');
            error.statusCode = CONFLICT;
            next(error);
          } else {
            const error = new Error('Ошибка на сервере');
            error.statusCode = SERVER_ERROR;
            next(error);
          }
        }));
  }
};

// Вход - авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        const err = new Error('error');
        err.name = 'UnknownError';
        throw err;
      }
      console.log(user);
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        res
          .status(UNAUTHORIZED)
          .send({ message: 'Указаны неправильные почта или пароль!' });
      } else if (err.name === 'UnknownError') {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
        next(error);
      }
    });
};

// Обновляем профиль
module.exports.patchUser = (req, res, next) => {
  UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => {
      if (data === null) {
        const err = new Error('errorId');
        err.name = 'ResourceNotFound';
        throw err;
      } else {
        const {
          email, name, about, avatar,
        } = data;
        res.status(GOOD_REQUEST).send({
          email, name, about, avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.Пользователь с указанным _id не найден.' });
      } else if (err.name === 'ResourceNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
        next(error);
      }
    });
};

// Обновляем Аватар
module.exports.patchAvatar = (req, res, next) => {
  UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => {
      if (data === null) {
        const err = new Error('errorId');
        err.name = 'ResourceNotFound';
        throw err;
      } else {
        const {
          email, name, about, avatar,
        } = data;
        res.status(GOOD_REQUEST).send({
          email, name, about, avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'ResourceNotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
        next(error);
      }
    });
};
