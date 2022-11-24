const CardShema = require('../models/card');
const ServerError = require('../errors/server-error');
const NotFound = require('../errors/not-found');
const IncorrectData = require('../errors/incorrect-data');
const Forbidden = require('../errors/forbidden');

const GOOD_REQUEST = 200;

// Создаем карточку
module.exports.postCard = (req, res, next) => {
  CardShema.create({ ...req.body, owner: req.user })
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new IncorrectData('Переданы некорректные данные при создании карточки.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// Удаляем карточку по ид
module.exports.deleteCard = (req, res, next) => {
  CardShema.findById(req.params.cardId)
    .orFail(() => {
      const err = new Error('errorId');
      err.name = 'ResourceNotFound';
      throw err;
    })
    .populate('owner')
    .then((data) => {
      if (req.user._id !== data.owner._id.toString()) {
        const err = new Error('errorId');
        err.name = 'Unauthorized';
        throw err;
      } else {
        CardShema.findByIdAndRemove(req.params.cardId)
          .then((datas) => {
            res.status(GOOD_REQUEST).send(datas);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        const error = new Forbidden('У вас нет прав на удаление этой карточки');
        next(error);
      } else if (err.name === 'ResourceNotFound') {
        const error = new NotFound('Карточка с указанным _id не найдена.');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new IncorrectData('Переданы некорректные данные при удалении создании карточки.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// Ставим лайк карточке
module.exports.putLike = (req, res, next) => {
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
        const error = new NotFound('Передан несуществующий _id карточки.');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new IncorrectData('Переданы некорректные данные для постановки лайка.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// Удаляем лайк у карточки
module.exports.deleteLike = (req, res, next) => {
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
        const error = new IncorrectData('Переданы некорректные данные для снятия лайка.');
        next(error);
      } else if (err.name === 'ResourceNotFound') {
        const error = new NotFound('Передан несуществующий _id карточки.');
        next(error);
      } else {
        const error = new ServerError('Ошибка на сервере');
        next(error);
      }
    });
};

// Возвращаем все карточки
module.exports.getCards = (req, res, next) => {
  CardShema.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch(() => {
      const error = new ServerError('Ошибка на сервере');
      next(error);
    });
};
