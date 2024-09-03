const mongoose = require('mongoose');
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

module.exports = mongoose.model('User', userSchema);