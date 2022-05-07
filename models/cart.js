const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var cart = Schema({
    cartId: {type:String,required:true},
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'customer'
    },
    menuItems: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'menuItem'
            },
            qty: int,
        }
    ],
    total: double
 });

 module.exports = mongoose.model('cart', cart)
