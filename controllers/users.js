const UserSchema = require("../models/user.js");

const GOOD_REQUEST = 200;
const INCORRECT_DATA = 400;
const SERVER_ERROR = 500;
const NOT_FOUND = 404;

// Возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  UserSchema.find({})
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch((err) => {
      res.status(SERVER_ERROR).send({message: "Ошибка на сервере"});
      console.log(err);
    });
};

// Возвращаем пользователя по ид
module.exports.getUser = (req, res) => {
  const userId = req.params.userId;

  UserSchema.findById(userId)
    .then((data) => {
      if(data === null) {
        const err = new Error("errorId");
        err.name = "Validate";
        throw err;
      } else {
        res.status(GOOD_REQUEST).send(data);
      }
    })
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(INCORRECT_DATA).send({message: "Передан некоректный _id."})
      } else if(err.name === "Validate") {
        res.status(NOT_FOUND).send({message: "Пользователь по указанному _id не найден."})
      } else {
        res.status(SERVER_ERROR).send({message: "Ошибка на сервере"});
        console.log(err);
      }
    });
};

// Создаем пользователя
module.exports.postUser = (req, res) => {
  UserSchema.create(req.body)
    .then((data) => res.status(GOOD_REQUEST).send(data))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(INCORRECT_DATA).send({message: "Переданы некорректные данные при создании пользователя."});
      } else {
        res.status(SERVER_ERROR).send({message: "Ошибка на сервере"});
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
    .then((data) => {
      if(data === null) {
        const err = new Error("errorId");
        err.name = "Validate";
        throw err;
      } else {
        res.status(GOOD_REQUEST).send(data);
      }
    })
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(INCORRECT_DATA).send({message: "Переданы некорректные данные при обновлении профиля."});
      } else if(err.name === "CastError") {
        res.status(INCORRECT_DATA).send({message: "Переданы некорректные данные при обновлении аватара.Пользователь с указанным _id не найден."})
      } else if(err.name === "Validate") {
        res.status(NOT_FOUND).send({message: "Пользователь с указанным _id не найден."});
      } else {
        res.status(SERVER_ERROR).send({message: "Ошибка на сервере"});
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
    .then((data) => {
      if(data === null) {
        const err = new Error("errorId");
        err.name = "Validate";
        throw err;
      } else {
        res.status(GOOD_REQUEST).send(data);
      }
    })
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(INCORRECT_DATA).send({message: "Переданы некорректные данные при обновлении аватара."});
      } else if(err.name === "CastError") {
        res.status(INCORRECT_DATA).send({message: "Переданы некорректные данные при обновлении аватара."})
      } else if(err.name === "Validate") {
        res.status(NOT_FOUND).send({message: "Пользователь с указанным _id не найден."});
      } else {
        res.status(SERVER_ERROR).send({message: "Ошибка на сервере"});
        console.log(err);
      }
    });
};