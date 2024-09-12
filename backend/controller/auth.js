const User = require('../model/user');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");



encryptPassword =  async(password)=>{
    try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt) ;
    return {hashedPassword,salt};
        }    
        catch(error)
        {
            console.log("error in hashing password",error);
        }

    }

exports.signUp= async(req,res)=>{
    try{
        console.log(req.body);
    const { name, email, hashed_password } = req.body
    console.log(name);
    const {hashedPassword,salt} = await encryptPassword(hashed_password);
     const user = await new User({
        name: name,
        email: email,
        hashed_password:hashedPassword,
        salt:salt
    });
      const savedUser=  await user.save();
      const userResponse = savedUser.toObject();
      delete userResponse.hashed_password;
        res.json({user: userResponse,token: user.generateToken()});
    }
   

catch(error)
{
    console.log("error in signing up: ",error);
    res.status(500).json({error:'error in signing up'});
}
}

exports.login = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        const isMatched = await bcrypt.compare(password, user.hashed_password);
        if(!user || !isMatched)
        {
            return res.status(400).json({message:"invalid email or password"});
        }
        else
        {
            return res.status(201).json({message: "login successfull",user:{
                name:user.name,
                email:user.email
            }, token: user.generateToken(),});
        }
    }
    catch(error)
    {
        console.log("Error",error);
        res.status(400).json({message:"error in login"});
    }
}
  
randomOtp =()=>{
    return Math.floor(1000 + Math.random() * 9000);
}

exports.forgot=async(req,res)=>{
    try{
    const {email}= req.body;
    const user = await User.findOne({email: email});
    if(!user)
    {
        return res.status(400).json({message: "Invalid email entered"})
    }
    else{
        const otp = randomOtp();
        const mail = await sendMail(email,otp);
        return res.status(201).json({otp :otp ,message:"Your OTP genrated successfully"});
    }
    }
    catch(error)
    {
        console.log("error", error);
        res.status(400).json({message: "error in forgot password"});
    }
}

sendMail = (userEmail,otp) => {    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: `${userEmail}`,        
        subject: "OTP For SIGN UP",
        text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if(err){            
            console.log(err);
            return;
        }
       
        console.log("Sent: " + info.response);
        return otp
    });    
};




