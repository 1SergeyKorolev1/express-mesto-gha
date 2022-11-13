const UserSchema = require("../models/user.js");

// Возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  UserSchema.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
};

// Возвращаем пользователя по ид
module.exports.getUser = (req, res) => {
  const userId = req.params.userId;

  UserSchema.findById(userId)
    .then((data) => {
      if(data === null) {
        return Promise.reject(new Error("errorId"));
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(400).send({message: "Передан некоректный _id."})
      } else if(err.name === "Error") {
        res.status(404).send({message: "Пользователь по указанному _id не найден."})
      } else {
        res.status(500);
        console.log(err);
      }
    });
};

// Создаем пользователя
module.exports.postUser = (req, res) => {
  UserSchema.create(req.body)
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные при создании пользователя."});
      } else {
        res.status(500);
        console.log(err);
      }
    });
};

// Обновляем профиль
module.exports.patchUser = (req, res) => {
  UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about
    },
    {
      new: true,
      runValidators: true
    }
  )
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные при обновлении профиля."});
      } else if(err.name === "CastError") {
        res.status(404).send({message: "Пользователь с указанным _id не найден."})
      } else {
        res.status(500);
        console.log(err);
      }
    });
};

// Обновляем Аватар
module.exports.patchAvatar = (req, res) => {
  UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar
    },
    {
      new: true,
      runValidators: true
    }
  )
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные при обновлении аватара."});
      } else if(err.name === "CastError") {
        res.status(404).send({message: "Пользователь с указанным _id не найден."})
      } else {
        res.status(500);
        console.log(err);
      }
    });
};