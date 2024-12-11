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
        res.status(200).json({message : "Profile picture updated successfully"});
    }catch(err){
        res.status(400).json({message : "Profile picture could not be updated"});
    }
};

exports.getProfile = async (req, res) => {
    try{
        const { email } = req.query;
        // console.log("Email = " + email);
        const user = await User.findOne({ email });
        // console.log(user.profile);
        const img = `data:image/jpg;base64,${user.profile.data.toString('base64')}`;
        console.log(img);
        res.status(200).json({ profile : img });
    }catch(err){
        res.status(400).json({message : "No profile exists"});
    }

};