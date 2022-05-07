const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const StrgOrderSchema = new Schema({
    orderId: String,
    customer: String,
    supplier: String,
    requiredDate:String,
    shippedDate: String,
    orderLocation: String,
    state:String,
    orderItems: [{
      type: Schema.Types.ObjectId,
      ref: 'StrgOrderItem'
   }]
},
{timestamps: true});

module.exports = mongoose.model('StrgOrder', StrgOrderSchema);