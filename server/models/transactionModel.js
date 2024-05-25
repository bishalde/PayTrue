const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
