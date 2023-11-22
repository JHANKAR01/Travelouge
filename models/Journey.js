const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  journeyName: String,
  pnr:String,
  passengers: [],
  source:String,
  destination:String,
  date_of_departure:Date,
  time_of_departure:String,
  date_of_arrival:Date,
  time_of_arrival:String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Journey', journeySchema);