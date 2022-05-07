const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var kitchenOrder = Schema({
    orderId: {type:String,required:true},
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
            qty: int
        }
    ],
    state: String
 });

 module.exports = mongoose.model('kitchenOrder', kitchenOrder)
