const joi=require('joi');
const AppError=require('../helpers/AppError');

const signUpSchema=joi.object({
    name:joi.string().alphanum().min(3).max(30).required(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

const signUpValidation=(req,res,next)=>{
    const {error} = signUpSchema.validate(req.body);
    if (error) 
    {
        return next(new AppError(error));
    }
    next();
}

const loginSchema=joi.object({
    name:joi.string().alphanum().min(3).max(30).required(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

const loginValidation=(req,res,next)=>{
    const {error}=loginSchema.validate(req.body);
    if(error){
        return next(new AppError(error));
    }
    next();
}

module.exports={signUpValidation,loginValidation};