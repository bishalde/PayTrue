const mongoose = require('mongoose');

const fixedDepositSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    durationMonths: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },interestAmount: {
        type: Number,
        required: true,
    },
    maturityAmount: {
        type: Number,
        default: 0,
    },
    maturityDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Add a pre-save middleware to calculate the maturity date
fixedDepositSchema.pre('save', function(next) {
    if (this.isNew) {
        const maturityDate = new Date(this.createdDate);
        maturityDate.setMonth(maturityDate.getMonth() + this.durationMonths);
        this.maturityDate = maturityDate;
    }
    next();
});

const fixedDeposit = mongoose.model('FixedDeposit', fixedDepositSchema);
module.exports = fixedDeposit;
