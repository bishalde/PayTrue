const express = require("express");
const Users = require("../models/userModel");
const Wallet = require("../models/walletModel");
const router = express.Router();

router.get("/",async (req, res) => {
  const uid = req.query.uid;
  const WalletData = await Wallet.findOne({ uid: uid });
  res.status(200).json(WalletData);
});

module.exports = router;
