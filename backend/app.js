const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",authRoutes);

const port = process.env.PORT || 5000 ;
const connectDB = async() => {
    await mongoose.connect(`${process.env.MONGODB}`)
    console.log(`Database connected with ${mongoose.connection.host}`);
}
connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})