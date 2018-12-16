
require('dotenv').config();

const express = require('express');
const socket = require('socket.io');
const ejsLayouts = require('express-ejs-layouts');

const app = express();

require('./startup/db')();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);

const port = process.env.PORT || 5000;
const server = app.listen(port, function() {
  console.log(`Listening on port ${port}...`)
});

const io = socket(server);
require('./startup/socket-io')(io);

app.get('/', function(req, res) {
  res.render('pages/home');
});
