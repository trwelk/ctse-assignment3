const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const StrgLocationSchema = new Schema({
    locationId: String,
    temperature: Number,
    humidity: Number,
},
{timestamps: true});

module.exports = mongoose.model('StrgLocation', StrgLocationSchema);