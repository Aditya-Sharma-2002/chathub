const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { Server } = require('socket.io');
const { createServer } = require('http');

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

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
    socket.on('message', (data) => {
        console.log(`Message received: `, data);
        io.emit('message', data);
    });
    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});