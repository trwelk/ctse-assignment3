const mongoose = require('mongoose');
const {Schema} = require('mongoose');

var menuItem = Schema({
    itemId: {type:String,required:true},
    name: String,
    price: double,
    ingredients: [
        {
            ingredient: {
                type: Schema.Types.ObjectId,
                ref: 'ingredient'
            },
            qty: double,
        }
    ],
    size: String
 });

 module.exports = mongoose.model('menuItem', menuItem)
