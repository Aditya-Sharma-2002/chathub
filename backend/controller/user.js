const User = require('../model/user');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.setProfile = async (req, res) => {
    try{        
        const { email } = req.body;
        await User.updateOne(
            { email : email },
            {$set : { profile : req.file.buffer }}
        );
        return res.status(200).json({message : "Profile picture updated successfully"});
    }catch(err){
        return res.status(400).json({message : "Profile picture could not be updated"});
    }
};

exports.getProfile = async (req, res) => {
    try{
        const { email } = req.query;
        console.log("Email = " + email);
        const user = await User.findOne({ email });
        // console.log(user.profile);
        const img = `data:image/jpeg;base64,${user.profile.toString('base64')}`;
        // console.log(img);

        return res.status(200).json({ profile : img });
    }catch(err){
        return res.status(400).json({message : "No profile exists"});
    }
};

exports.searchUsers = async (req, res) => {
    try{
        const users = await User.find({ username : { $regex : req.query.username, $options : 'i'}});
        // console.log(users);
        return res.status(200).json({ users : users});
    }catch(err){
        return res.status(400).json({ message : 'No user found'});
    }
}