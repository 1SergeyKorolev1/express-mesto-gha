const CardShema = require("../models/card.js");

// Создаем карточку
module.exports.postCard = (req, res) => {
  //const {name, link} = req.body
  //console.log(name, link); - с этим вариантом тоже работает. оставил тот чтоб не забыть

  CardShema.create({...req.body, owner: req.user._id, createdAt: new Date()})
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      if(err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные при создании карточки."});
      } else {
        res.status(500).send(err)
      }
    });
};

// Удаляем карточку по ид
module.exports.deleteCard = (req, res) => {
  CardShema.findByIdAndRemove(req.params.cardId)
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(404).send({message: "Карточка с указанным _id не найдена."})
      } else {
        res.status(500).send(err)
      }
    });
};

// Ставим лайк карточке
module.exports.putLike = (req, res) => {
  CardShema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные для постановки лайка."});
      } else if(err.name === "CastError") {
        res.status(404).send({message: "Передан несуществующий _id карточки."})
      } else {
        res.status(500).send(err)
      }
    });
};

// Удаляем лайк у карточки
module.exports.deleteLike = (req, res) => {
  CardShema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, //  убрать _id из массива
    { new: true },
  )
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные для снятия лайка."});
      } else if(err.name === "CastError") {
        res.status(404).send({message: "Передан несуществующий _id карточки."})
      } else {
        res.status(500).send(err)
      }
    });
};

// Возвращаем все карточки
module.exports.getCards = (req, res) => {
  CardShema.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
};