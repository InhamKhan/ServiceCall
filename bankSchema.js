var mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    transaction_id:{
        type: Number,
    },
    amount:{
        type: Number,
    },
    details:{
        type: String,
    },
    from_acc:{
        type: Number,
    },
    to_acc:{
        type: Number,
    },
});
const transaction =  mongoose.model("transaction", transactionSchema);

const accountSchema = mongoose.Schema({
    ac_id:{
        type: Number,
    },
    title:{
        type: String,
    },
    balance:{
        type: Number,
    },
});
const account =  mongoose.model("account", accountSchema);

module.exports = {
    transaction,
    account
};