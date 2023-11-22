const mongoose = require('mongoose');

const userSchema={
    email:String,
    name:String,
    password:String
};

module.exports = mongoose.model("User",userSchema);
