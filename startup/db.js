
const mongoose = require('mongoose');

module.exports = function() {

  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })
    .then(() => console.log('Connected to mLab database...'))
    .catch(err => console.log('Couldnt connect to db: ', err));

}
