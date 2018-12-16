
const Message = require('../models/message');


let onlineUsers = [];

function socketIO(io) {

  io.on('connection', function(client) {

    onlineUsers = onlineUsers.concat(client.id);

    client.broadcast.emit('login', {
      status: 'New user has logged in'
    });

    io.emit('online', onlineUsers.length);

    io.to(client.id).emit('chatClosed');


    client.on('disconnect', function() {
      client.broadcast.emit('logout', {
        status: 'User has logged out'
      });

      onlineUsers = onlineUsers.filter(x => x !== client.id);

      io.emit('online', onlineUsers.length);
    });


    client.on('leave', function(user) {
      const status = {
        status: `${user} has left this chat room`
      };

      client.broadcast.emit('leave', status);

      io.to(client.id).emit('chatClosed');
    });


    client.on('join', function() {
      const status = {
        status: 'New user has joined this chat room'
      };

      client.broadcast.emit('join', status);

      io.to(client.id).emit('chatOpened');
    });


    client.on('message', function(data) {
      io.emit('message', data);

      addMessage(data);
    });


    client.on('typing', function(user) {

      client.broadcast.emit('typing', {
        message: `${user} is typing a message ...`
      });
    });


    client.on('history', async function listMessages() {

        const messages = await Message
          .find()
          .select('user message -_id');

        io.to(client.id).emit('history', messages);

    });


    client.on('clearHistory', deleteMessages);

  });

}

async function addMessage(message) {

  await new Message(message).save();

}

async function deleteMessages() {

  await Message.deleteMany();

}

module.exports = socketIO;
