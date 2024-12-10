const User = require('../model/user');
const multer = require('multer');
const upload = multer({dest : ''})
exports.profile = async (req, res) => {
    try{
        console.log(req.body);
        const { email } = req.body;
        const user = await User.findOne({ email });
        user.profile = req.buffer;
        await user.save();
        res.status(200).json({message : "Profile picture updated successfully"});
    }catch(err){
        res.status(400).json({message : "Profile picture could not be updated"});
    }
}