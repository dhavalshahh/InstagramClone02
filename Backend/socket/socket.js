const { Server } = require('socket.io');
const { sendMessage } = require('../controllers/chat.controller');

let io;
const userSocketMap = {};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('userOnline', (userId) => {
      userSocketMap[userId] = socket.id;
      io.emit('userOnline', userId);
      console.log(`User ${userId} is online`);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      try {
        const newMessage = await sendMessage(senderId, receiverId, message);
        
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', newMessage);
        }

        socket.emit('receiveMessage', newMessage);
      } catch (error) {
        socket.emit('messageError', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      const userId = Object.keys(userSocketMap).find(
        key => userSocketMap[key] === socket.id
      );
      
      if (userId) {
        delete userSocketMap[userId];
        io.emit('userOffline', userId);
        console.log(`User ${userId} is offline`);
      }
      
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };