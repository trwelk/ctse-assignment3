const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var StrgOrderItem = Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'StrgOrder',
     },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'StrgProduct',
     },
    quantity: Number,
    deliverableQuantity:{type:Number,default: 0},
    stock:{
        type: Schema.Types.ObjectId,
        ref: 'StrgStock'
    },
    state:String
 });

 module.exports = mongoose.model('StrgOrderItem', StrgOrderItem)
