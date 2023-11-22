const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  place:{type:String,unique: true} 
});

module.exports = mongoose.model('Place', placeSchema);