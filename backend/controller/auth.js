const User = require('../model/user');
const bcrypt = require('bcrypt');


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
        res.json({user: userResponse});
    }
    // user.save();
    // user.salt = undefined;
    // res.status(201).json({message:"user created successfully"});

catch(error)
{
    console.log("error in signing up: ",error);
    res.status(500).json({error:'error in singning up'});
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
            }});
        }
    }
    catch(error)
    {
        console.log("Error",error);
        res.status(400).json({message:"error in login"});
    }
}

