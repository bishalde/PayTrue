const express = require("express");
const TransactionDb = require("../models/transactionModel");
const Wallet = require("../models/walletModel");
const fdDb = require("../models/fixedDepositModel");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Fixed Deposit Endpoint" });
});

router.post("/", async (req, res) => {
  const Data = req.body;
  try {
    const wallet = await Wallet.findOne({ uid: Data.uid });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    if (wallet.balance < Data.amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    wallet.balance -= Data.amount;
    await wallet.save();

    const interest = (Data.amount * Data.interestRate * (Data.durationMonths/12) ) / 100;

    const newFD = new fdDb(Data);
    newFD.interestAmount = interest;
    newFD.maturityAmount = Data.amount + interest;
    await newFD.save();

    const newTransaction = new TransactionDb();
    newTransaction.uid = Data.uid;
    newTransaction.type = "debit";
    newTransaction.amount = Data.amount;
    newTransaction.description = "Fixed Deposit - "+newFD._id;

    await newTransaction.save();





    res.status(201).json({ message: "Transaction created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
