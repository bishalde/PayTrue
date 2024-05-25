const express = require("express");
const { isValidObjectId } = require('mongoose'); // Import isValidObjectId
const Users = require("../models/userModel");
const Card = require("../models/cardModel"); // Import Card model

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const uid = req.query.uid;
    if (!uid || !isValidObjectId(uid)) {
      return res.status(400).json({status:404,error: 'Valid user ID is required' });
    }
    const userData = await Users.findOne({ _id: uid });
    if (!userData) {
      return res.status(404).json({ status:404,error: 'User not found' });
    }

    // Fetch the card details
    const cardData = await Card.findOne({ uid: uid });
    if (!cardData) {
      return res.status(404).json({ status:404,error: 'Card not found' });
    }

    res.status(200).json({ ...userData._doc, card: cardData._doc });
  } catch (error) {
    res.status(500).json({ status:404,error: 'Server error', message: error.message });
  }
});

module.exports = router;
