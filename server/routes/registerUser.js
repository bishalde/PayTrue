const express = require("express");
const Users = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Card = require("../models/cardModel");


const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Register Endpoint" });
});

router.post("/", async (req, res) => {
  const userData = req.body;
  try {
    const newUser = new Users(userData);
    await newUser.save();
    const newWallet = new Wallet();
    newWallet.uid = newUser._id;
    await newWallet.save();
    // Generate unique card details for the user
    const cardData = {
      uid: newUser._id,
      cardNumber: Math.floor(Math.random() * 9000000000000000) + 1000000000000000,
      expiryDate: new Date().setFullYear(new Date().getFullYear() + 3),
      cvv: Math.floor(100 + Math.random() * 900),
    };

    // Create a new card
    const newCard = new Card(cardData);
    await newCard.save();
    res.status(200).json({ message: "Account created successfully", data:{uid:newUser._id }, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
