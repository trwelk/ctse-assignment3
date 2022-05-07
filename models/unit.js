const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var unit = Schema({
    unitId: {type:String,required:true},
    name: String,
 });

 module.exports = mongoose.model('unit', unit)
