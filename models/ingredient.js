const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var ingredient = Schema({
    ingredientId: {type:String,required:true},
    name: String,
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'unit'
    }
 });

 module.exports = mongoose.model('ingredient', ingredient)
