const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var StrgStock = mongoose.Schema({
    stockId: {type:String,required:true},
    product: {
        type: Schema.Types.ObjectId,
        ref: 'StrgProduct',
        required: true
     },
    supplierId: String,
    recievedDate: String,
    recievedQty: Number,
    outGoingQty: Number,
    stockLocation: {
        type: Schema.Types.ObjectId,
        ref: 'StrgLocation',
        required: true
     },
    purchasePrice: Number,
    deflectionFromIdealHarvest:Number,
    daysSinceHarvested: Number,
    predictedExpiryDate: String

    //addrecievingDate

 });

 module.exports = mongoose.model('StrgStock', StrgStock)
