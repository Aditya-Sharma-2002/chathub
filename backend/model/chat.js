const mongoose = require('mongoose');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true,
        // required: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

chatSchema.methods.encryptContent = function(content) {
    try{
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        let encrypted = cipher.update(content, "utf8", "hex");
        encrypted += cipher.final("hex");
        return { iv: iv.toString("hex"), content: encrypted };
    }catch(err){
        console.log(err);
        return 'Some error has occured ' + err;
    }
}

chatSchema.methods.decryptContent = function(encryptedObj){
    try{
        const decipher = crypto.createDecipheriv(
            algorithm,
            secretKey,
            Buffer.from(encryptedObj.iv, "hex")
        );
        let decrypted = decipher.update(encryptedObj.content, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }catch(err){
        console.log(err);
        return 'Some error has occured ' + err ;
    }
}

module.exports = mongoose.model('Chat', chatSchema);
