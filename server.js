
require('dotenv').config();

const express = require('express');
const socket = require('socket.io');
const helmet  = require('helmet');
const mongoose = require('mongoose');
const ejsLayouts = require('express-ejs-layouts');

const Message = require('./models/message');

const app = express();

app.use(helmet());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(ejsLayouts);

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to mLab'))
  .catch(err => console.error('Could not connect to mLab: ', err));

async function addMessage() {
  const message = new Message({
    user: 'Jack',
    message: 'Hello Tom!'
  });
  
  const result = await message.save();
  console.log(result);
}

async function listMessages() {
  const array = await Message
    .find()
    .select('user message -_id'); // excluding _id from query
    // .count(); // gives an amount of items in DB
  console.log(array);
}

async function deleteMessage() {
  const deleted = await Message.deleteMany();
  console.log(deleted);
}

// deleteMessage();
listMessages();

const port = process.env.PORT || 5000;
const server = app.listen(port, function() {
  console.log('Listening on port:', port)
});


// ========== SOCKET LOGIC ================
const io = socket(server);
require('./socket-io')(io);

// ========== ROUTES ================
app.get('/', function(req, res) {
  res.render('pages/home');
});
