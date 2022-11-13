const CardShema = require("../models/card.js");

// TODO: РЕВЬЮ №1. (Чтобы отлавливать ошибку валидации, необходимо добавить опцию,
// TODO: чтобы данные для обновления валидировались. Нужно исправить здесь и в других местах.)
// TODO: При добавлении опции {runValidators: true} Не чего не происходит
// TODO: в eslintrc если убрать quotes вылезет куча ошибок из за скобок 2-ых, а я с ними привык...

// Создаем карточку
module.exports.postCard = (req, res) => {
  CardShema.create({...req.body, owner: req.user })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      console.log(err);
      if(err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные при создании карточки."});
      } else {
        res.status(500);
        console.log(err);
      }
    });
};

// Удаляем карточку по ид
module.exports.deleteCard = (req, res) => {
  CardShema.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if(data === null) {
        return Promise.reject(new Error("errorId"));
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if(err.name === "Error") {
        res.status(404).send({message: "Карточка с указанным _id не найдена."});
      } else if(err.name === "CastError") {
        res.status(400).send({message: "Переданы некорректные данные при удалении создании карточки."})
      } else {
        res.status(500);
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
      runValidators: true
    }
  )
    .then((data) => {
      if(data === null) {
        return Promise.reject(new Error("errorId"));
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if(err.name === "Error") {
        res.status(404).send({message: "Передан несуществующий _id карточки."});
      } else if(err.name === "CastError") {
        res.status(400).send({message: "Переданы некорректные данные для постановки лайка."})
      } else {
        res.status(500);
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
      runValidators: true
    },
  )
    .then((data) => {
      if(data === null) {
        return Promise.reject(new Error("errorId"));
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(400).send({message: "Переданы некорректные данные для снятия лайка."});
      } else if(err.name === "Error") {
        res.status(404).send({message: "Передан несуществующий _id карточки."})
      } else {
        res.status(500);
        console.log(err);
      }
    });
};

// Возвращаем все карточки
module.exports.getCards = (req, res) => {
  console.log(req.body);
  CardShema.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
};