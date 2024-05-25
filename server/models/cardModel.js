const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  cvv: {
    type: Number,
    required: true
  }
});

const Card = mongoose.model("Card", CardSchema);

module.exports = Card;
