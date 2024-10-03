
const mongoose = require('mongoose');
// 1- Create Schema
const userSchema = new mongoose.Schema(
  {
username: {type: String, required: true},
email: {type: String, required: true, unique:true},

password: {type: String, required: true},

phone: {type: String, default:"0123456789"},
mileprim: {type: String, default:"1000"},
milequal: {type: String, default:"0"},








},{timestamps: true} );

const User = mongoose.model('user', userSchema);

module.exports = User;
