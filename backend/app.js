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

app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',chatRoutes);

const port = process.env.PORT || 5000 ;
const connectDB = async() => {
    await mongoose.connect(`${process.env.MONGODB}`)
    console.log(`Database connected with ${mongoose.connection.host}`);
}
connectDB();

const io = new Server(httpServer, {
    cors : {
        origin : "*",
        methods : ['GET','POST'],
        credentials : true,
    },
});

chatController.initIO(io);

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // join a user's room
  socket.on('join', (userId) => {
    socket.join(userId);    
    console.log(`User ${userId} joined their room`);
  });

  // handle sending a new message
  socket.on('message', async ({ senderId, receiverId, text }) => {
    try {
      // find or create chat between two users
      let chat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [senderId, receiverId] }
      });

      if (!chat) {
        chat = await Chat.create({
          users: [senderId, receiverId],
          isGroupChat: false,
        });
      }

      // create and save message
      const message = await Message.create({
        sender: senderId,
        content: text,
        chat: chat._id,
      });

      // update latest message in chat
      chat.latestMessage = message._id;
      await chat.save();

      // send to receiver and back to sender (so sender sees it too)
      [receiverId, senderId].forEach(id => {
        io.to(id).emit('receiveMessage', {
          senderId,
          text,
          createdAt: message.createdAt,
          chatId: chat._id,
        });
      });

    } catch (err) {
      console.error("Error in message handler:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});



httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});