/* eslint-disable import/extensions */
const router = require('express').Router();
const {
  getUsers, getUser, postUser, patchUser, patchAvatar,
} = require('../controllers/users.js');

// Возвращаем всех пользователей
router.get('/', getUsers);
// Возвращаем пользователя по ид
router.get('/:userId', getUser);
// Создаем пользователя
router.post('/', postUser);
// Обновляем профиль
router.patch('/me', patchUser);
// Обновляем Аватар
router.patch('/me/avatar', patchAvatar);

module.exports = router;
