const expres = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/mestodb");

const app = expres();

// Хардкодим ид пользователя
app.use((req, res, next) => {
  req.user = {
    _id: "636ba8441698cf8ab7b1cf1f"
  };

  next();
});

// Парсим все пакеты в джсон рег.боди
app.use(bodyParser.json());

// Все запросы на /users
app.use("/users", require("./routes/users.js"));

// Все запросы на /cards
app.use("/cards", require("./routes/cards.js"));

app.listen(3000, () => {
  console.log("server started");
});
