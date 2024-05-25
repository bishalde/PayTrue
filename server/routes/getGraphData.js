const express = require("express");
const TransactionDb = require("../models/transactionModel");

const router = express.Router();

router.get("/", async (req, res) => {
    const uid = req.query.uid;
    const transactions = await TransactionDb.find({ uid: uid }).sort({ date: -1 }).select("category amount type description");
    const categoryTotalsDebit = {};
    const categoryTotalsCredit = {};
    const categoryCountsDebit = {};
    const categoryCountsCredit = {};
    let totalDebits = 0;
    let totalCredits = 0;
    transactions.forEach(transaction => {
        if (transaction.type === 'debit') {
            totalDebits += transaction.amount;
            if (categoryTotalsDebit.hasOwnProperty(transaction.category)) {
                categoryTotalsDebit[transaction.category] += transaction.amount;
                categoryCountsDebit[transaction.category]++;
            } else {
                categoryTotalsDebit[transaction.category] = transaction.amount;
                categoryCountsDebit[transaction.category] = 1;
            }
        } else if (transaction.type === 'credit') {
            totalCredits += transaction.amount;
            if (categoryTotalsCredit.hasOwnProperty(transaction.category)) {
                categoryTotalsCredit[transaction.category] += transaction.amount;
                categoryCountsCredit[transaction.category]++;
            } else {
                categoryTotalsCredit[transaction.category] = transaction.amount;
                categoryCountsCredit[transaction.category] = 1;
            }
        }
    });
    const categoryWithPercentagesDebit = [];
    for (const category in categoryTotalsDebit) {
        const value = categoryTotalsDebit[category];
        const percentage = (value / totalDebits) * 100;
        categoryWithPercentagesDebit.push({ category, value, percentage, count: categoryCountsDebit[category] });
    }
    const categoryWithPercentagesCredit = [];
    for (const category in categoryTotalsCredit) {
        const value = categoryTotalsCredit[category];
        const percentage = (value / totalCredits) * 100;
        categoryWithPercentagesCredit.push({ category, value, percentage, count: categoryCountsCredit[category] });
    }

    res.status(200).json({ 
        debits: { categoryWithPercentages: categoryWithPercentagesDebit, total: totalDebits },
        credits: { categoryWithPercentages: categoryWithPercentagesCredit, total: totalCredits }
    });
});

module.exports = router;
