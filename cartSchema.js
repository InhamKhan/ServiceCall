 var mongoose = require("mongoose");

 const  cartSchema = mongoose.Schema({
p_name:{
type: String,
},
unit_price:{
    type: Number,
    require: true,
},
quantity:{
    type: Number,
},
total:{
    type: Number,
    require: true,
},
 });
 module.exports = mongoose.model("shoppingcart", cartSchema);