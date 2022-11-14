const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('cards', cardSchema);
