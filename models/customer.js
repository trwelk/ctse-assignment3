const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var customer = Schema({
    customerId: {type:String,required:true},
    email: {type:String,required:true},
    password: String,
    dob: Date,
    gender: String,
 });

 module.exports = mongoose.model('customer', customer)
