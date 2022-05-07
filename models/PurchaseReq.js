const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const PurchaseReqSchema = new Schema({
    purchaseReqId: String,
    supplier: String,
    requiredDate:String,
    deliveryLocation: String,
    state:String,
    purchaseReqItems: [{
      type: Schema.Types.ObjectId,
      ref: 'PurchaseReqItem'
   }]
},
{timestamps: true});

module.exports = mongoose.model('PurchaseReq', PurchaseReqSchema);