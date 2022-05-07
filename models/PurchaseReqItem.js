const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const PurchaseReqItem = Schema({
    purchaseReq: {
        type: Schema.Types.ObjectId,
        ref: 'StrgOrder',
     },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'StrgProduct',
     },
    quantity: Number,
    state:String
 });

 module.exports = mongoose.model('PurchaseReqItem', PurchaseReqItem)
