const express = require("express");
const TransactionDb = require("../models/transactionModel");
const Wallet = require("../models/walletModel");

const router = express.Router();

router.get("/",async (req, res) => {
  const uid = req.query.uid;
  const TransactionData =await TransactionDb.find({ uid: uid }).sort({ date: -1 }).select("amount date description type category");
  res.status(200).json(TransactionData);
});

router.post("/", async (req, res) => {
  const transactionData = req.body;
  try {
    const wallet = await Wallet.findOne({ uid: transactionData.uid });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    if (transactionData.type === "debit") {
      if (wallet.balance < transactionData.amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      wallet.balance = wallet.balance - transactionData.amount;
    } else {
      wallet.balance = wallet.balance + transactionData.amount;
    }
    if(transactionData.amount < 10){
      wallet.coins = wallet.coins + 2;
    }
    else if(transactionData.amount < 100){
      wallet.coins = wallet.coins + 5;
    }
    else if(transactionData.amount < 1000){
      wallet.coins = wallet.coins + 10;
    }
    else if(transactionData.amount < 10000){
      wallet.coins = wallet.coins + 20;
    }
    else{
      wallet.coins = wallet.coins + 25;
    }
    await wallet.save();
    const newTransaction = new TransactionDb(transactionData);
    newTransaction.category = "deposit"
    await newTransaction.save();
    res.status(200).json({ message: "Transaction created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
