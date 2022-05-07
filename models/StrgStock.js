const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var Product = mongoose.Schema({
    id: {type:String,required:true},
    merchant: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true
     },
    name: String,
    price: Number,
    quantity: Number,
    coupons: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
     }]


 });

 module.exports = mongoose.model('Product', Product)
