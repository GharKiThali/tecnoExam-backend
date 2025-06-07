const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    
  },
  otp: {
    type: String,
    default: ''
  },
  otpExpire: Date,
  firstName: String,
  lastName: String,
  city: String,
});

module.exports = mongoose.model('User', userSchema);
