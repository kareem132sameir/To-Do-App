const jwt=require('jsonwebtoken');
const AppError=require('../helpers/AppError');
const User=require('../models/user.js');



const verfiy_token=async function(req, res, next) {
    const token=req.headers.authorization;
    if(!token) return next(new AppError('please provide a token'))
    const user_id=jwt.verify(token,process.env.JWT_Seceret);
    const id=user_id.id;
    const user=await User.findById(id);
    if(!user) return next(new AppError('user not found'));
    req.user=user;
    // console.log(user_id);
    next();
};

module.exports={verfiy_token};
