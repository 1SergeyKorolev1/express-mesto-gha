/* eslint-disable func-names */
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },

  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    validate: {
      validator(v) {
        return /http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?/gi.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('error');
        err.name = 'Unauthorized';
        throw err;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('error');
            err.name = 'Unauthorized';
            throw err;
          }

          return user;
        });
    });
};

module.exports = mongoose.model('users', userSchema);
