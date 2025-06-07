require('dotenv').config();
const mongoose = require('mongoose');

function connect() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
    });
}

module.exports = connect;

