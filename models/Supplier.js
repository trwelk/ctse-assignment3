const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const SupplierSchema = new Schema({
    supplierId: String,
    contactNumber: Number,
    email: String,
    address: String,
    contactNumber2: Number,
},
{timestamps: true});

module.exports = mongoose.model('Supplier', SupplierSchema);