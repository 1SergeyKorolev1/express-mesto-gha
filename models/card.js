const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  likes: {
    type: Array,
  },

  createdAt: {
    type: Date,
  }
});

module.exports = mongoose.model("cards", cardSchema);