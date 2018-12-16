
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: {
    name: String,
    unique: true,
    required: true
  },
  password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
