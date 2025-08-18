const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { Server } = require('socket.io');
const { createServer } = require('http');
const morgan = require('morgan');
const Message = require('./model/message');
const Chat = require('./model/chat');
const chatController = require('./controller/chat');

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', chatRoutes);

const port = process.env.PORT || 5000;

const connectDB = async () => {
  await mongoose.connect(`${process.env.MONGODB}`);
  console.log(`Database connected with ${mongoose.connection.host}`);
};
connectDB();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

chatController.initIO(io);

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // client joins a chat room by chatId
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  // now sockets only broadcast, they don’t save
  socket.on("sendMessage", ({ message, chatId, sender }) => {
    // broadcast to all sockets in the room
    io.to(chatId).emit("receiveMessage", {
      ...message,
      sender,
      chatId,
    });
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});