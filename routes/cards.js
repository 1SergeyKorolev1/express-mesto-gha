/* eslint-disable import/extensions */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  postCard, deleteCard, putLike, deleteLike, getCards,
} = require('../controllers/cards.js');

// Создаем карточку
router.post('/', postCard);

// Удаляем карточку по ид
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

// Ставим лайк карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), putLike);

// Удаляем лайк у карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteLike);

// Возвращаем все карточки
router.get('/', getCards);

module.exports = router;
