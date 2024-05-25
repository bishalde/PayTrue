const express = require("express");

const TransactionDb = require("../models/transactionModel");
const router = express.Router();

router.post("/",async (req, res) => {
  const data = req.body
  try{
    const newTransaction = new TransactionDb(data);
    await newTransaction.save();
    res.status(200).json({ message: "Transaction created successfully",status:true });
  } catch (error) {
    res.status(500).json({ error: error.message,status:false });
  }
});

module.exports = router;
