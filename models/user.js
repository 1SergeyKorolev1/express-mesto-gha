/* eslint-disable no-useless-escape */
/* eslint-disable func-names */
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
    default: 'https://clck.ru/32igDv',
    type: String,
    validate: {
      validator(v) {
        return /http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[\#$]?/gi.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
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
