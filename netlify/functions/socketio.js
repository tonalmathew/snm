const { Server } = require('socket.io');

exports.handler = async (event, context) => {
  const io = new Server();

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Socket.IO server is running" }),
  };
};