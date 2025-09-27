const userModel =  require('../models/user.model');
const bycrpt  = require('bcrypt');
const jwt  = require("jsonwebtoken");
async function registerUsers(req,res) {
    const {fullname:{firstname,lastname},email,password }  = req.body;
    const isUserAlreadyExist = await userModel.findOne({email});
    if(isUserAlreadyExist){
        res.status(400).json({message:"user already exists"});
    }
    const HashPassword = await bycrpt.hash(password,10);
    
    const user  = await userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password:HashPassword
    })
    const token  = await jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.cookie("token",token);
    res.status(201).json({message:"the user is created successfully"},{
        user:{
            email:user.email,
            id:user._id,
            fullname:user.fullname
        }
    })
}
async function loginUsers(req,res){
        const {email,password}= req.body;
        const user = await userModel.findOne({email});
        if(!user){
            res.json({message:"the email  or password is wrong"});
        }  
        const isPasswordValid =  await bycrpt.compare(password,user.password);

        if(!isPasswordValid) {
            res.json({message:"the email or password is incorrect "});
        }

        const token  = await jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.cookie("token",token);
        res.status(200).json({
        message: "user is logged in successfully",
        user: {
            email: user.email,
            _id:user._id,
            fullname:user.fullname
        }
    });
}

module.exports ={
    registerUsers,
    loginUsers
}