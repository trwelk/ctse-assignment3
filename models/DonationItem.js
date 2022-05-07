const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const DonationItem = new Schema({
    product: {
      type: Schema.Types.ObjectId,
      ref: 'StrgProduct'
   },
    stock: {
      type: Schema.Types.ObjectId,
      ref: 'StrgStock'
   },
   recipient:String,
   quantity: Number,
   expiryDate:String,
   state:String
},
{timestamps: true});

module.exports = mongoose.model('Donation', StrgOrderSchema);