const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  city:String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
