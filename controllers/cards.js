/* eslint-disable no-console */
/* eslint-disable import/extensions */
const CardShema = require('../models/card.js');

const GOOD_REQUEST = 200;
const INCORRECT_DATA = 400;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;

// Создаем карточку
module.exports.postCard = (req, res) => {
  CardShema.create({ ...req.body, owner: req.user })
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
        console.log(err);
      }
    });
};

// Удаляем карточку по ид
module.exports.deleteCard = (req, res) => {
  CardShema.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (data === null) {
        const err = new Error('errorId');
        err.name = 'ResourceNotFound';
        throw err;
      } else {
        res.status(GOOD_REQUEST).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'ResourceNotFound') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при удалении создании карточки.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
        console.log(err);
      }
    });
};

// Ставим лайк карточке
module.exports.putLike = (req, res) => {
  CardShema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
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
        res.status(GOOD_REQUEST).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'ResourceNotFound') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
        console.log(err);
      }
    });
};

// Удаляем лайк у карточки
module.exports.deleteLike = (req, res) => {
  CardShema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, //  убрать _id из массива
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
        res.status(GOOD_REQUEST).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.name === 'ResourceNotFound') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
        console.log(err);
      }
    });
};

// Возвращаем все карточки
module.exports.getCards = (req, res) => {
  CardShema.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      console.log(err);
    });
};
