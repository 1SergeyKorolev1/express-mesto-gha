const expres = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/mestodb");

const app = expres();

// Хардкодим ид пользователя
app.use((req, res, next) => {
  req.user = {
    _id: "6370dd2a2fa52ebb0cd085ab"
  };

  next();
});

// Парсим все пакеты в джсон рег.боди
app.use(bodyParser.json());

// Все запросы на /users
app.use("/users", require("./routes/users.js"));

// Все запросы на /cards
app.use("/cards", require("./routes/cards.js"));

// Не существующие запросы
app.use("/", (req, res) => {
  res.status(404).send({message: "Такого адреса не существует"})
});


app.listen(3000, () => {
  console.log("server started");
});
