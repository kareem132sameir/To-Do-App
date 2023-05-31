const AppError=require('../helpers/AppError');
const User=require('../models/user.js');
const bcrypt=require('bcrypt');
const joi=require('joi');
const jwt=require('jsonwebtoken');


const signUp=async (req, res, next) => 
{
    const { name, password } = req.body;

    if (!name || !password) return next(new AppError('Invalid email or password', 404));

    let user =await User.findOne({name});

    if(user)
    {
        res.send("user already exists,Please Login!");
    }
    else
    {
        let user=new User({name, password});
        user.savePassword(password);
        await user.save();
        user.password = undefined;
        res.send(user);
    }
  };
  
const login=async (req, res, next) => {
    const { name, password } = req.body;
    if (!name || !password) return next(new AppError('Invalid email or password', 404));
    const user = await User.findOne({ name }).exec();
    if(!user) return next(new AppError('Invalid user', 404));
    const isMatch=user.checkPassword(password);
    if(!isMatch) return next(new AppError('Invalid email or password', 404));
    const token=jwt.sign({id:user._id},process.env.JWT_Seceret);
    console.log(token);
    user.password=undefined;
    user.loggedIn = true;
    res.send({token,user});
  };

const getUsers=async (req,res,next)=>{
    // const users=await User.find();
    const users = await User.find().select('-password');
    if(!users) return next(new AppError('user lists not found',404));
    res.send(users);
};

const getOneUser=async (req,res,next)=>{
    try
    {
        const id=req.params.id;
        const user=await User.findById(id);
        res.send(user);
    }
    catch
    {
        next(new AppError('user not found',404));
    }
}

const deleteByName=async (req,res,next)=>{
    const {name}=req.body;
    if(!name) return next(new AppError('user list not found',404))
    await User.findOneAndDelete({name});
    const users=await User.find();
    res.send(users);
}

const deleteByID=async (req,res,next)=>{
    const id=req.params.id;
    try
    {
        const user=await User.findById(id);
    }
    catch
    {
        next(new AppError('user list not found',404));
    }
    await User.findByIdAndDelete(id);
    const users=await User.find();
    res.send(users);
}

module.exports={signUp,login,getUsers,getOneUser,deleteByName,deleteByID};