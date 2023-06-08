const express = require('express')
const AppError=require('../helpers/AppError');
const router = express()
const User=require('../models/user.js');
const bcrypt=require('bcrypt');
const joi=require('joi');
const {signUpValidation,loginValidation}=require('../helpers/validationSchema.js');
const {signUp,login,getUsers,getOneUser,deleteByName,deleteByID} = require('../controllers/authenticationController.js');

router.get('/',getUsers)

router.get('/:id',getOneUser);

router.post('/signup',signUpValidation,signUp);

router.post('/login',loginValidation,login);

router.delete('/',deleteByName);

router.delete('/:id',deleteByID);

router.patch('/',async (req,res,next)=>{
    const {title,status}=req.body;
    if(!title || !status) return next(new AppError('please to do list title or status not entered',404))
    const user=await User.findOneAndUpdate({ title }, { $set: { status } },{ new: true });
    res.send(user);
    // const todoObject=user.toObject()
});

router.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

module.exports=router;
