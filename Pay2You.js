var express = require("express");
var eSession = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var ejs = require("ejs");
var cors = require("cors");
var path = require("path");
var helperBankService = require("./bankService");
var helper = require("./addCart")
const cartSchema = require("./cartSchema");
//const bankSchema = require("./bankSchema");
const { dir } = require("console");
const { dirname } = require("path");

var myApp = express();
myApp.use(eSession({secret: 'ssshhhh', saveUninitialized:true, resave:true}));
myApp.use(bodyParser.urlencoded({extended: true}));
myApp.use(cors({origin: "*"}));

myApp.set("views", __dirname);
myApp.set("view engine", "ejs");

myApp.post("/pay2You.rest",helperBankService.pay2You);
myApp.post("/checkBalance.rest",helperBankService.checkBalance);


var server = myApp.listen(8090, initFunction);
function initFunction(){
    port = server.address().port;
    host = server.address().address;
    console.log("host =" + host + " " +port);
}