
let messages = [];
let onlineUsers = [];

module.exports = (io) => {

  io.on('connection', function(socket) {
    console.log('New user connected, id:', socket.id);

    onlineUsers = onlineUsers.concat(socket.id);

    socket.broadcast.emit('login', {
      status: 'New user has logged in'
    });

    io.emit('online', onlineUsers.length);

    io.to(socket.id).emit('chatClosed');

    socket.on('disconnect', function() {
      socket.broadcast.emit('logout', {
        status: 'User has logged out'
      });

      console.log('User disconnected, id:', socket.id);

      onlineUsers = onlineUsers.filter(x => x !== socket.id);

      io.emit('online', onlineUsers.length);
    });


    socket.on('leave', function(user) {
      const status = {
        status: `${user} has left this chat room`
      };

      socket.broadcast.emit('leave', status);

      io.to(socket.id).emit('chatClosed');
    });


    socket.on('join', function() {
      const status = {
        status: 'New user has joined this chat room'
      };

      socket.broadcast.emit('join', status);

      io.to(socket.id).emit('chatOpened');
    });


    socket.on('message', function(data) {
      io.emit('message', {
        user: data.user,
        message: data.message
      });

      messages = messages.concat(data);
    });


    socket.on('typing', function(user) {

      socket.broadcast.emit('typing', {
        message: `${user} is typing a message ...`
      });
    });


    socket.on('history', function() {

      io.to(socket.id).emit('history', messages)
    });

  });

}