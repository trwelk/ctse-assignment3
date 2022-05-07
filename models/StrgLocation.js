const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const CouponSchema = new Schema({
    id: String,
    influencerTier: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
     },
    influencerDiscountPercentage: Number,
    commisionPercentage: Number
},
{timestamps: true});

module.exports = mongoose.model('Coupon', CouponSchema);