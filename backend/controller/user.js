const User = require('../model/user');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.setProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    await User.updateOne(
      { email: email },
      { $set: { profile: base64Image } }
    );

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profile: base64Image
    });
  } catch (err) {
    return res.status(400).json({ message: "Profile picture could not be updated" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user || !user.profile) {
      return res.status(404).json({ message: "No profile exists" });
    }

    return res.status(200).json({ profile: user.profile });
  } catch (err) {
    return res.status(400).json({ message: "No profile exists" });
  }
};

exports.searchUsers = async (req, res) => {
    try {
        let users = await User.find({ 
            username: { $regex: req.query.username, $options: 'i' }
        }).select('-email -hashedPassword -salt -friends');

        users = users.map(user => ({
            ...user._doc,
            profile: `${user.profile.toString('base64')}`
        }));

        return res.status(200).json({ users });
    } catch (err) {
        return res.status(400).json({ message: 'Some error occurred' });
    }
};

exports.setNames = async (req, res) => {
    try{
        const user = await User.updateOne({ _id : req.body._id }, {
            name : req.body.name,
            username : req.body.username
        });
        console.log(user);
        return res.status(200).json({
            name : user.name,
            username : user.username
        });
    }catch(err){
        return res.status(400).json({ message : 'Some error occurred' });
    }
}