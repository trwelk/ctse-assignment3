const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const StrgProductSchema = new Schema({
    productId: String,
    productName: String,
    productType: String,
    description: String,
    unitOfMeasurement: String,
    stocks: [{
      type: Schema.Types.ObjectId,
      ref: 'StrgStock'
   }],
   unitPrice:String
},
{timestamps: true});

module.exports = mongoose.model('StrgProduct', StrgProductSchema);