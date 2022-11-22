/* eslint-disable import/extensions */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, patchUser, patchAvatar,
} = require('../controllers/users.js');

// Возвращаем всех пользователей
router.get('/', getUsers);
// Возвращаем пользователя по ид
router.get('/:userId', getUser);
// Обновляем профиль
router.patch('/me', patchUser);
// Обновляем Аватар
router.patch('/me/avatar', patchAvatar);

module.exports = router;
