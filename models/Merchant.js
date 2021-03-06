const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const MerchantSchema = new Schema({
    name: String,
    email: String,
    address: String,
    businessName: String,
    contact:Number,
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
   }],
   password:String
},
{timestamps: true});

module.exports = mongoose.model('Merchant', MerchantSchema);