const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const MerchantSchema = new Schema({
    id: String,
    name: String,
    email: String,
    address: String,
    businessName: String,
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
   }],
   password:String
},
{timestamps: true});

module.exports = mongoose.model('Merchant', MerchantSchema);