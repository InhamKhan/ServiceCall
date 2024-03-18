var express = require("express");
var eSession = require("express-session");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const { response } = require("express");
const cartSchema = require("./cartSchema");

myServer = express();
myServer.use(eSession({secret: 'ssshhhh', saveUninitialized:true, resave:true}));

async function addShoppingCart(request, response){
    console.log("addShoppingCart()....");
    var productName = request.body.p_name; 
    var unitPrice = request.body.unit_price;
    var totalQuantity = request.body.quantity;

    let cartSchema = mongoose.model("shoppingcart");

    let shoppingcartJson = {
        p_name: productName,
        unit_price: unitPrice,
        quantity: totalQuantity,
    };

    console.log("shoppingcart =" + JSON.stringify(shoppingcartJson));
    var tempShopping = new cartSchema(shoppingcart);

    try {
        console.log("saving shoppingcart item  in DB");
        tempShopping.save();
        console.log("shoppingcart Items are Saved in DB");
    } catch (error) {
        console.error(error);
        response.status(500);
        response.end(error);
    }
    response.setHeader("Content-Type", "text/html");
    var result = `<html><tittle>SHoppingCart</tittle><body><h1>Items Of ShoppingCart s Added to DB</h1></body></html>`;
    response.end(result);
    console.log("addShoppingCart is End Here()..");
}

async function updateShoppingCart(request, response){
    console.log("updateShoppingCart()...");
    
    let cartInformation = mongoose.model("shoppingcart");
    var productName = request.body.p_name; 
    var unitPrice = request.body.unit_price;
    var totalQuantity = request.body.quantity;

    console.log("totalQuantity =" + totalQuantity);
    let queryString = {
        "p_name": productName,
    }
    console.log("queryString =" + JSON.stringify(queryString));
    var cartInformationResult;
    try {
        cartInformationResult = await cartInformation.findOne(queryString);

        if(cartInformationResult) {
            console.log("cartInformationResult = "+cartInformationResult.p_name);
            
            console.log("cartInformationResult.total  = "+cartInformationResult.total);
            cartInformationResult.quantity =  Number(totalQuantity);
            cartInformationResult.total = cartInformationResult.quantity * cartInformationResult.unit_price;
            await cartInformationResult.save();
            console.log("updateShoppingCart =" + cartInformationResult);
            response.end(JSON.stringify(cartInformationResult));
        }else{ 
            response.status(404).json({ message: `${productName} not found`});
        } 
    } catch(error) {
        console.log(error);
        response.status(500).json({ message: `Updating the Cart for ${productName}`});
        }
    }
    // async function deleteShoppingCart(request, response){
    //     let cartInformation = mongoose.model("shoppingcart");
    //     console.log("deleteShoppingCart()....");
        
    //     var doc_id = request.body.doc_id;
    //     console.log(doc_id);

    //     let queryString ={
    //         _id: doc_id,
    //     };
    //     console.log("queryString =" + JSON.stringify.queryString);
    //     var shoppingcartResult;
    //     try{
    //         console.log("Query from the DB");
    //         shoppingcartResult = await cartInformation.findOne(queryString);
    //         await shoppingcartResult.delete();
    //     }catch (error){
    //         console.log(error);
    //         response.status(500);
        
    //     console.log("cartInformation = " + shoppingcartResult);
    //     response.setHeader("COntent-Type", "text/html");
    //     var result = `<html><tittle>ShoppingCart</tittle><body><h1>The Information of ShoppingCart is Deleted... </h1></body></html>`;
    //     response.end(result);
    //     console.log("delete shoppingCart from DB..");
    //     }
    // }
    async function getShoppingCartById(request, response){
        console.log("getShoppingCart()....");

        let cartInformation = mongoose.model("shoppingcart");
        var doc_id = request.query.doc_id;

        let queryString = {
            p_name : doc_id,
        };
        console.log("queryString = " +JSON.stringify(queryString));
        var shoppingcartResult;
        try{
            console.log("Query from DB");
            shoppingcartResult = await cartInformation.findOne(queryString);
        } catch (error) {
            console.log(error);
            response.status(500);
            response.end(error);
        }
        console.log("shoppingcartResult = " + shoppingcartResult );

        response.render("editShoppingCart", { shoppingcart: shoppingcartResult });
        console.log("getShoppingCartById is End Here.");
    }

async function listShoppingCart(request, response){
    let shoppingCart = request.session.shoppingcart;
    if(!(Array.isArray(shoppingCart) && shoppingCart.length));
    console.log("shoppingCart not found in Session..Checking...");
    shoppingCart = [];
    let unit_price = 210;
    let quantity = 3;
    let cartInformation = {
        "p_name": "Kids Bed",
        "quantity": quantity,
        "unit_price": unit_price,
        "total": quantity * unit_price, 
    };
    shoppingCart.push(cartInformation);
    unit_price = 500,
    quantity = 1,
    cartInformation = {
        "p_name": "Kids Chair",
        "quantity": quantity,
        "unit_price": unit_price,
        "total": quantity * unit_price,
    };
    unit_price = 810,
    quantity = 3,
    cartInformation = {
        "p_name": "Baby Cart",
        "quantity": quantity,
        "unit_price": unit_price,
        "total": quantity * unit_price,
    };
    shoppingCart.push(cartInformation);
    request.session.shoppingCart = shoppingCart;
    console.log("shopping = "+ shoppingCart);
    response.render("listShoppingCart", {data : request.session.shoppingCart});
    console.log("List of ShoppingCart is End Here...");
}
    module.exports = {
        addShoppingCart,
        updateShoppingCart,
        // deleteShoppingCart,
        getShoppingCartById,
        listShoppingCart,
       
    } 