const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    coins:{
        type: Number,
        default: 100
    },
    loan:{
        type: Number,
        default: 0
    }
})

const Wallet = mongoose.model('Wallet', walletSchema)
module.exports = Wallet