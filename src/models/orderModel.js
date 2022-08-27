const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const orderSchema = new mongoose.Schema({
   
   userId : {
    type : ObjectId,
    ref : "userDocument"
   },
   productId : {
    type : ObjectId,
    ref : "productDocument"
   },
   amount : Number,
   isFreeAppUser : Boolean,
   date : String

}, {timestamps : true} );


module.exports = mongoose.model('OrderDocument', orderSchema)