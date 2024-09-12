const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            trim : true,
            required : true,
            maxLength : 32
        },
        email : {
            type : String,
            trim : true,
            required : true,
            unique : true

        },
        hashed_password : {
            type : String,
            required : true
        },
        salt : {
            type : String,
            required : true
        },
        friends : [{
            type : ObjectId
        }],
        chat : {
            type : ObjectId,
            ref : "Chat"
        }
    }, {timestamps : true}
);

userSchema.methods.generateToken = function(){

    try{
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email
        },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30d' } 
    );
    }
    catch(error)
    {
        console.log("Error in generatin token",error)
    }
}


module.exports = mongoose.model('User', userSchema);