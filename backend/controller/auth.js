const User = require("../model/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { hashedPassword, salt };
  } catch (error) {
    console.log("error in hashing password", error);
  }
};

exports.signUp = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, newPassword } = req.body;
    console.log(name);
    const { hashedPassword, salt } = await encryptPassword(newPassword);
    const user = await new User({
      name: name,
      email: email,
      hashedPassword: hashedPassword,
      salt: salt,
    });
    const savedUser = await user.save();
    const userResponse = {
      _id : savedUser._id,
      name : savedUser.name,
      email : savedUser.email
    };
    return res.status(201).json({
      message: "Sign up successfull",
      user: userResponse,
      token: user.generateToken()
    });
  } catch (error) {
    console.log("error in signing up: ", error);
    return res.status(500).json({ error: "error in signing up" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      console.log("User don't exist")
      return res.status(400).json({ message: "User don't exist"});
    }
    const isMatched = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect password" });
    } else {
      return res.status(201).json({
        message: "login successfull",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username || '',
          profile : user.profile ? `${user.profile.toString('base64')}` : '',
          friends : user.friends
        },
        token: user.generateToken(),
      });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ message: "error in login" });
  }
};

exports.logout = (req, res) => {
  try{
    return res.status(201).json({message : "Logout successfull"})
  }catch(err){
    console.log(err);
    return res.status(400).json({message: "Logout unsuccessfull"})
  }
};

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.forgot = async (req, res) => {
  try {    
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if(!user)
      return res.status(404).json({ error : "Email not found" })

    const otp = generateOTP();

    // Create transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_APP_PASS, // 16-digit app password
      },
    });

    // Mail options
    const mailOptions = {
      from: `"ChatHub Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code for Password Reset",
      html: `
        <div style="background: #e0e5ec; font-family: Arial, sans-serif; padding: 20px; text-align: center; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div style="
          background: #e0e5ec; 
          box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
          border-radius: 20px;
          padding: 30px;
          max-width: 500px;
          width: 100%;
        ">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
            Use the OTP below to reset your password. This code is valid for <b>5 minutes</b>.
          </p>
          <div style="
            background: #e0e5ec;
            box-shadow: inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff;
            border-radius: 12px;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #333;
            display: inline-block;
            margin-bottom: 30px;
          ">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #777;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent successfully", otp });

  } catch (err) {
    console.error("Nodemailer error:", err.message || err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email, newPassword);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { hashedPassword, salt } = await encryptPassword(newPassword);
    user.hashedPassword = hashedPassword;
    user.salt = salt;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};