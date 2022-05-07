const mongoose = require('mongoose');

var storageItemScheme = mongoose.Schema({
    id: String,
    genericName: String,
    category: String,
    unitOfMeasurement: String
 });

 module.exports = mongoose.model('storageItem', storageItemScheme)
