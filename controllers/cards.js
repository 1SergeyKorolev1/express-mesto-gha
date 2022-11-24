const CardShema = require('../models/card');

const GOOD_REQUEST = 200;
const INCORRECT_DATA = 400;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;
const UNAUTHORIZED = 403;

// Создаем карточку
module.exports.postCard = (req, res, next) => {
  CardShema.create({ ...req.body, owner: req.user })
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Переданы некорректные данные при создании карточки.');
        error.statusCode = INCORRECT_DATA;
        next(error);
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
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
        const error = new Error('У вас нет прав на удаление этой карточки');
        error.statusCode = UNAUTHORIZED;
        next(error);
      } else if (err.name === 'ResourceNotFound') {
        const error = new Error('Карточка с указанным _id не найдена.');
        error.statusCode = NOT_FOUND;
        next(error);
      } else if (err.name === 'CastError') {
        const error = new Error('Переданы некорректные данные при удалении создании карточки.');
        error.statusCode = INCORRECT_DATA;
        next(error);
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
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
        const error = new Error('Передан несуществующий _id карточки.');
        error.statusCode = NOT_FOUND;
        next(error);
      } else if (err.name === 'CastError') {
        const error = new Error('Переданы некорректные данные для постановки лайка.');
        error.statusCode = INCORRECT_DATA;
        next(error);
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
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
        const error = new Error('Переданы некорректные данные для снятия лайка.');
        error.statusCode = INCORRECT_DATA;
        next(error);
      } else if (err.name === 'ResourceNotFound') {
        const error = new Error('Передан несуществующий _id карточки.');
        error.statusCode = NOT_FOUND;
        next(error);
      } else {
        const error = new Error('Ошибка на сервере');
        error.statusCode = SERVER_ERROR;
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
      const error = new Error('Ошибка на сервере');
      error.statusCode = SERVER_ERROR;
      next(error);
    });
};
