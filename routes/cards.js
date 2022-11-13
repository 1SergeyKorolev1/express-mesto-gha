const router = require("express").Router();
const { postCard, deleteCard, putLike, deleteLike, getCards } = require("../controllers/cards.js");

// Создаем карточку
router.post("/", postCard);

// Удаляем карточку по ид
router.delete("/:cardId", deleteCard);

// Ставим лайк карточке
router.put("/:cardId/likes", putLike);

// Удаляем лайк у карточки
router.delete("/:cardId/likes", deleteLike);

// Возвращаем все карточки
router.get("/", getCards);

module.exports = router;