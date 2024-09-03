const User = require('../model/user');
const bcrypt = require('bcrypt');


encryptPassword =  async(password)=>{
    try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt) 
    return hashedPassword;
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
    const hashedPassword = await encryptPassword(hashed_password);
    const user = new User({
        name,
        email,
        hashed_password:hashedPassword
    });
    user.save((err, savedUser)=>{
        if(err){
            return res.status(400).json({error: 'Email is taken'})
        };
        savedUsed.salt
       savedUser.friend = undefined;
       savedUser.chat= undefined;
        res.json({user: savedUser});
    })
}
catch(error)
{
    console.log("error in signing in: ",error);
    res.status(500).json({error:'error in singning in'});
}
}

