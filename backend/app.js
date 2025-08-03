const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { Server } = require('socket.io');
const { createServer } = require('http');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { error } = require('console');

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.use('/api',authRoutes);
app.use('/api',userRoutes);

const port = process.env.PORT || 5000 ;
const connectDB = async() => {
    await mongoose.connect(`${process.env.MONGODB}`)
    console.log(`Database connected with ${mongoose.connection.host}`);
}
connectDB();

const io = new Server(httpServer, {
    cors : {
        origin : 'http://localhost:5173',
        methods : ['GET','POST'],
        credentials : true,
    },
});

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on('message', ({senderId, receiverId, message}) => {
        console.log(`Message from ${senderId} to ${receiverId}: `, message);
        io.to(receiverId).emit('receiveMessage', message);
    });
    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

const otpLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 3,
    message: {
        error: "Too many OTP requests from this IP, please try again after 15 minutes."
    }
});

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});