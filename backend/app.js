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
//const URI = "mongodb://localhost:27017/chatHub";
const connectDB = async() => {
    await mongoose.connect(`${process.env.MONGODB}`)
    console.log(`Database connected with ${mongoose.connection.host}`);
}
connectDB();


/*try{
mongoose.connect(URI,({
    useNewUrlParser:true,
    useUnifiedTopology:true
}))
console.log("Connected to mongoDB");
}
catch(error)
{
    console.log("Error in connecting to database", error);
}
*/

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})