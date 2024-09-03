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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})