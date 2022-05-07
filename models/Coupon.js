const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const Coupon = new Schema({
    influencerTier: String,
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
     },
    influencerDiscountPercentage: Number,
    commisionPercentage: Number
},
{timestamps: true});

module.exports = mongoose.model('Coupon', Coupon);