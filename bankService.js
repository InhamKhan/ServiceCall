var express = require("express");
var eSession = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const {transaction} = require("./bankSchema");
const {account} = require("./bankSchema");
const { response } = require("express");

mongoose.connect("mongodb://0.0.0.0:27017/PaymentGateway");
const mongoDb = mongoose.connection;
mongoDb.on("error", console.error.bind(console, "connection error"));
mongoDb.once("open", function(){
    console.log("Connected to DB");
});

async function pay2You(request, response){
    console.log("pay2You().....");

    var details = request.body.details;
    var to_account = request.body.to_acc;
    var from_account = request.body.from_acc;
    var amo = request.body.amount;
    
    let bankSchema  = mongoose.model("transaction");
    let accountSchema  = mongoose.model("account");

    let transactionJson = {
        "details":details,
        "to_acc":to_account,
        "from_acc":from_account,
        "amount":amo,
    }
    console.log("transaction =" +JSON.stringify(transactionJson));
    var temp = new bankSchema(transactionJson);
    try{
        console.log("saving Record In DB");
        temp.save();
        console.log("record is Saved in DB");
    } catch(error) {
        console.error(error);
        response.status(500);
        response.end(error);
    }

    let accSearchJson = {
        "ac_id":from_account,
    }
    let fromAccount = null;
    try{
        fromAccount = await accountSchema.findOne(accSearchJson);
        console.log("fromAccount.balance = "+fromAccount.balance);
        fromAccount.balance = fromAccount.balance - Number(amo);
        fromAccount.save();
        console.log("fromAccount saved, balance = "+fromAccount.balance);
    } catch(error) {
        console.error(error);
        response.status(500);
        response.end(error);
    }

    accSearchJson = {
        "ac_id":to_account,
    }
    let toAccount = null;
    try {
        toAccount = await accountSchema.findOne(accSearchJson);
        console.log("toAccount balance = "+toAccount.balance);
        toAccount.balance = toAccount.balance + Number(amo);
        toAccount.save();
        console.log("toAccount saved, balance = "+fromAccount.balance);
    } catch(error) {
        console.error(error);
        response.status(500);
        response.end(error);
    }

    response.status(201);
    var result = `{"status" : Success}`;
    response.end(result);
    console.log("pay2You successful");
};
async function checkBalance(request, response) {
    console.log("checkBalance().....");
    var ac_id = request.body.ac_id; 

    let accountSchema  = mongoose.model("account");

    let accSearchJson = {
        "ac_id": ac_id,
    }
    try {
        let accountDetails = await accountSchema.findOne(accSearchJson);
        if (!accountDetails) {
            response.status(404);
            response.end(`Account with ID ${ac_id} not found.`);
        } else {
            response.status(200);
            var result = `{"balance" : ${accountDetails.balance}}`;
            response.end(result);
        }
    } catch(error) {
        console.error(error);
        response.status(500);
        response.end(error);
    }
    console.log("checkBalance completed");
};
module.exports = {
    pay2You,
    checkBalance,
}