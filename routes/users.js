/* eslint-disable import/extensions */
const router = require('express').Router();
const {
  getUsers, getUser, patchUser, patchAvatar, getUserMe,
} = require('../controllers/users.js');

// Возвращаем всех пользователей
router.get('/', getUsers);
// Возвращаем инфу пользователя
router.get('/me', getUserMe);
// Возвращаем пользователя по ид
router.get('/:userId', getUser);
// Обновляем профиль
router.patch('/me', patchUser);
// Обновляем Аватар
router.patch('/me/avatar', patchAvatar);

module.exports = router;
