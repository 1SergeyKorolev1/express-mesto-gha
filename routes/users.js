/* eslint-disable import/extensions */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, patchUser, patchAvatar, getUserMe,
} = require('../controllers/users.js');

// Возвращаем всех пользователей
router.get('/', getUsers);
// Возвращаем инфу пользователя
router.get('/me', getUserMe);
// Возвращаем пользователя по ид
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);
// Обновляем профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), patchUser);
// Обновляем Аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?)/),
  }),
}), patchAvatar);

module.exports = router;
